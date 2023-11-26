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
        const testCollection = client.db("parcelDB").collection('users');

        app.get('/users',async(req,res)=>{
            const result = await testCollection.find().toArray();
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get("/", (req, res) => { res.send("Crud is running..."); });
app.listen(port, () => { console.log(`Simple Crud is Running on port ${port}`); });