const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require('cors');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7kmqy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) =>{
    res.send('Bike Store Agency Server is Running');
});

// console.log(uri);

async function run(){

    try{

        await client.connect();
        const database = client.db("bikeStore");
        const serviceCollection = database.collection("products");
        
        // get data
        app.get('/products', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);


        // Post data
        app.post('/products', async(req, res) =>{
            console.log('hitting the post' , req.body);
            const newPlace = req.body;
            const result = await serviceCollection.insertOne(newPlace);
            console.log(result);
            res.json(result);
        })
        });

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)




app.listen(port, () =>{
    console.log("Server Running at Port", port);
})