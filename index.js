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
        const productCollection = database.collection("products");
        const reviewCollection = database.collection("reviews");
        const bookingCollection = database.collection("booking");
        const adminCollection = database.collection('admin');


        
        
        // get Product data
        app.get('/products', async(req, res) =>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // Post Product data
        app.post('/products', async(req, res) =>{
            console.log('hitting the post' , req.body);
            const newPlace = req.body;
            const result = await productCollection.insertOne(newPlace);
            console.log(result);
            res.json(result);
        })

        // get Reviews data
        app.get('/reviews', async(req, res) =>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // Post Product data
        app.post('/reviews', async(req, res) =>{
            console.log('hitting the post' , req.body);
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            console.log(result);
            res.json(result);
        });

        // Add Booking
        app.post("/addbook", async(req, res) =>{
            const booking = req.body;
            console.log("booking",booking);
            bookingCollection.insertOne(booking).then((result) =>{
                res.send(result)
            })
        });

        // Post Booking
        app.get("/addBook", async(req, res) =>{
            const email = req.query.email;
            const query = {email:email}
            const cursor = bookingCollection.find(query);
            const booking = await cursor.toArray();
            res.send(booking)
        });

         //delete booking product
         app.delete("/addBook/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            console.log(id);
            const result = await bookingCollection.deleteOne(query);
            console.log("Deliting id",result);
            res.json(result)
         
        });

        // make Admin
        app.put('/admin', async(req,res)=>{
            const user = req.body;
            console.log('user', user);
            const filter = {email:user.email};
            const updateDoc = {$set: {role:'admin'}};
            const result = await adminCollection.updateOne(filter,updateDoc);
            res.send(result);
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