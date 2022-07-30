const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

// middleware 
app.use(cors());
app.use(express.json());

// 'c2b460b192c3912f08664922dd5f5d8d679dd8a0e3d1928e32f6ffc09d058ff72fb0ffc5f0d119c
// f23163f3c059b39435052'
function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({massage: "unauthorized access"})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) =>{
        if(err){
            return res.status(403).send({massage: "Forbidden access"});
        }
        console.log('decoded', decoded);
        req.decoded = decoded;
         next();
    })
    // console.log('inside verifyJWT',authHeader);
   
}


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mw67p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection = client.db('geniusCar').collection('order');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/service/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query
                );
            res.send(service);   
        });

        // post
        app.post('/service', async(req, res) =>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // delete
        app.delete('/service/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result)
        });
        // order post
        app.get('/order',verifyJWT, async(req,res) =>{
            // const authHeader = req.headers.authorization;
            // console.log('inside verifyJWT',authHeader);
            const decodedEmail = req.decoded.email;
            const email= req.query.email;
           if(decodedEmail === email){
            console.log(email);
            const query = {email: email};
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
           }
           else{
            res.status(403).send({massage: "forbidden access"});
           }
        });
        // order collection API
        app.post('/order', async(req, res) =>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });
        // AUTH
        app.post('/login',async (req, res) =>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '1d'
            });
            console.log(accessToken)
            res.send({accessToken});

        });

    }
    finally {

    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running app server')
});


app.listen(port, () => {
    console.log('success', port)
});
