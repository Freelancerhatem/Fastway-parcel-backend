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
async function run(){
    try{
        const userCollection = client.db("parcelDB").collection('users');

        app.get('/users',async(req,res)=>{
            const result = await userCollection.find().toArray();
            res.send(result);
        });
        app.patch('/users/admin/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)}
            const data = {userType: 'deliveryMan'};
            const result = await userCollection.updateOne(query,{$set: data });
            res.send(result);

        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get("/", (req, res) => { res.send("Crud is running..."); });
app.listen(port, () => { console.log(`Simple Crud is Running on port ${port}`); });