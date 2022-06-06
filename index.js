const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dsufg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res) => {
    res.send('connected data')
})

async function run() {
    await client.connect();
    const collection = client.db("test").collection("parts");
    const reviuecollection = client.db("test").collection("reviue");
    const orderCollection = client.db("test").collection("order");
    const userCollection = client.db("test").collection("user");

    try {
        // parts ---------------->>>
        app.post('/parts', async (req, res) => {
            const newParts = req.body;
            const result = await collection.insertOne(newParts);
            res.send(result);
        })
       
        app.post('/order', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })
        // reviue -------------->>>>>
        app.post('/reviue', async (req, res) => {
            const reviue = req.body;
            console.log(reviue);
            const result = await reviuecollection.insertOne(reviue);
            res.send(result);
        })
// get parts 
        app.get('/parts', async (req, res) => {
            const quary = {}
            const cursor = collection.find(quary);
            const product = await cursor.toArray();
            res.send(product)
        })
// get reviue 

        app.get('/reviue', async (req, res) => {
            const quary = {}
            const cursor = reviuecollection.find(quary);
            const reviue = await cursor.toArray();
            res.send(reviue)
        })
// get all user         
        app.get('/user', async (req, res) => {
            const quary = {}
            const cursor = userCollection.find(quary);
            const reviue = await cursor.toArray();
            res.send(reviue)
        })

        app.get('/parts/:_id', async(req, res)=>{
            const _id =req.params._id;
            const query ={_id: ObjectId(_id)};
            const product = await collection.findOne(query);
            res.send(product)
        })
        app.delete('/myorder/:_id', async(req, res)=>{
            const _id =req.params._id;
            const quary ={_id:ObjectId(_id)};
            const result = await orderCollection.deleteOne(quary);
            res.send(result);
            console.log(_id)
        })
        // update user informatin
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
             res.send(result)       
    });

    // find single user 

    app.get('/singleuser/:email',async(req, res)=>{
        const email =req.params.email;
        const quary ={email: email}
        const cursor = userCollection.find(quary)
        const product = await cursor.toArray()
        res.send(product)
    })


        app.get('/myorder', async (req, res)=>{
            const email =req.query.email;
            const quary ={email: email}
            const cursor = orderCollection.find(quary)
            const product = await cursor.toArray()
            res.send(product)
        })
        // get user 
        app.get('/user', async (req, res)=>{
            const email =req.query.email;
            const quary ={email: email}
            const cursor = userCollection.find(quary)
            const product = await cursor.toArray()
            res.send(product)
        })

    }

    finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('running is sarver')
})