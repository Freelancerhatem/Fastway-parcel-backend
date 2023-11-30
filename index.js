const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//uri here
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@assignmentdb.20nrhba.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        const userCollection = client.db("parcelDB").collection('users');
        const reviewsCollection = client.db("parcelDB").collection('reviews');
        const dmanCollection = client.db("parcelDB").collection('deliveryMan');
        const parcelCollection = client.db("parcelDB").collection('allparcel');

        app.post('/allusersdata', async (req, res) => {
            const usersData = req.body;
            const result = await userCollection.insertOne(usersData);
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            
            const result = await userCollection.find().toArray();
            res.send(result);
        });
        app.patch('/users/deliveryman/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const data = { userType: 'deliveryMan' };
            const result = await userCollection.updateOne(query, { $set: data });
            res.send(result);

        })
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const data = { userType: 'admin' };
            const result = await userCollection.updateOne(query, { $set: data });
            res.send(result);

        });
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        });
        app.get('/deliveryman', async (req, res) => {
            const result = await dmanCollection.find().toArray();
            res.send(result);
        });
        app.get('/allparcel', async (req, res) => {
            const result = await parcelCollection.find().toArray();
            res.send(result);
        })
        app.patch('/parcelstatus', async (req, res) => {
            const data = req.body;
            // console.log(data);
            const id = data.parcelId;
            const filter = { _id: new ObjectId(id) };
            const deliveryManId = data.id
            const query = { $set: { status: data.status, deliveryman: deliveryManId } }
            const options = { upsert: true };
            const update = await parcelCollection.updateOne(filter, query, options);
            res.send(update);
        });
        // filter delivery Man parcel data
        app.get('/myparceldata', async (req, res) => {
            const query = req.query.user;
            
            const useremail= {email:query}
            const mydbData = await dmanCollection.findOne(useremail);
            const{_id} = mydbData;
            const id = _id.toHexString();
            
            const mydeliveryData = await parcelCollection.find({deliveryman:id}).toArray();
            res.send(mydeliveryData);
        })
        // delivery status updated
        app.patch('/deliveryUpdate',async(req,res)=>{
            const {id} =req.body;
            console.log(id)
            
            const filter = {_id:new ObjectId(id)};
            const query = {$set:{status:'delivered'}};
            const result = await parcelCollection.updateOne(filter,query)
            res.send(result)

        });
        //parcel book by user
        app.post('/bookParcel',async(req,res)=>{
            const BookParcelData = req.body;
            const result = await parcelCollection.insertOne(BookParcelData);
            res.send(result);
        });
        // my parcel data with user email
        app.get('/userparcel',async(req,res)=>{
            const userEmail = req.query.email;
            
            const filter = {email:userEmail};
            const result = await parcelCollection.find(filter).toArray()
            res.send(result);
        })

        //my parcel update cancel status and update parcel data
        app.patch('/cancelStatus/:id',async(req,res)=>{
            const id = req.params.id;
            const filter = {_id:new ObjectId(id)}
            const query = {$set:{status:'cancelled'}}
            const result = await parcelCollection.updateOne(filter,query)
            res.send(result);
        });
        app.patch('/updateParcel/:id',async(req,res)=>{
            const id = req.params.id;
            const data=req.body
            
            const filter = {_id:new ObjectId(id)}
            const query = {$set:data}
            const result = await parcelCollection.updateOne(filter,query)
            res.send(result);
        });
        // check login user type and send his data
        app.get('/loginUserType',async(req,res)=>{
            const userEmail = req.query.user;
            
            const filter ={email:userEmail};
            const result = await userCollection.findOne(filter);
            res.send(result);
        });
        // update the image of user
        app.patch('/updateImage',async(req,res)=>{
            const userEmail = req.query.user;
            const filter = {email:userEmail};
            const {img} = req.body;
            const query ={$set:{image:img}}
            const result = await userCollection.updateOne(filter,query)
            res.send(result);
        });
        // delivery man data with sort by delivery
        app.get('/topdeliveryman',async(req,res)=>{
            const query={parcelsDelivered:-1}
            const result = await dmanCollection.find().sort(query).toArray();
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get("/", (req, res) => { res.send("Crud is running..."); });
app.listen(port, () => { console.log(`Simple Crud is Running on port ${port}`); });