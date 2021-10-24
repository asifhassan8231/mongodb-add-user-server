const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());

/* 
user:mongouser1
password:BOac9Oa1JG5xBs0q
*/

const uri = "mongodb+srv://mongouser1:BOac9Oa1JG5xBs0q@cluster0.yb4zx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("userDrive");
        const usersCollection = database.collection("users");

        //get all users from the database
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //new user insert 
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.json(result);
        })

        //delete an user
        app.delete('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })

        //find a specific user
        app.get('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) };
            const result = await usersCollection.findOne(query);
            res.send(result);

            //update an user data
            app.put('/users/:id', async (req, res) => {
                const id = req.params.id;
                const updatedUser = req.body;
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        name: updatedUser.name,
                        email: updatedUser.email
                    },
                };
                const result = await usersCollection.updateOne(filter, updateDoc, options);
                console.log('hitting it');
                res.json(result);
            })
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello, is it working?')
})


app.listen(port, () => {
    console.log('listening to ', port)
})
