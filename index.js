const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9q6ocyc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    const allToDoCollection = client.db("jobTaskDB").collection("allToDo")

    //post task 
    app.post("/allToDo", async (req, res) => {
      const product = req.body
      const result = await allToDoCollection.insertOne(product)
      res.send(result)
    })
    //get task
    app.get("/allToDo/", async (req, res) => {
      const email = req.query.email
      console.log(email);
      let user;
      if (email) {
        user = {email:email}
}
      const cursor = allToDoCollection.find(user)
      const result = await cursor.toArray()
      res.send(result)
    })

    //update task 
    app.patch("/update/:id", async (req, res) => {
      const _id = req.params.id;
      const query = req.query.query;
      console.log(_id, query)
      const filter = { _id: new ObjectId(_id) }
      let updateQuery;
      if (query === 'ongoing') {
        updateQuery = { $set: { status: 'ongoing' } };
      } else if (query === 'complete') {
        updateQuery = { $set: { status: 'complete' } };
      } else {
        updateQuery = { $set: { status: 'todo' } };
      }

      const result = await allToDoCollection.updateOne(filter, updateQuery);
      console.log("from the last", result)

    })
    //   // Get single user role
    //   app.get('/allToDo/:email', async (req, res) => {
    //     const email = req.params.email
    //     console.log(email);
    //     const query = { email: email }
    //     const result = await allToDoCollection.findOne(query)
    //     res.send(result)
    // })
    // app.put("/allToDo/:id", async(req, res)=>{
    //     const id =req.params.id 
    //     const taskData = req.body
    //     const filter = {_id : new ObjectId(id)}
    //     const option ={upsert: true}
    //     const updateProduct ={
    //       $set:{
    //         title:taskData.title,
    //         description:taskData.description,
    //         date:taskData.date,
    //         priority:taskData.priority,

    //       }
    //     }
    //     const result = await allToDoCollection.updateOne(filter, updateProduct,option)
    //     res.send(result)
    //   })


    //delete
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await allToDoCollection.deleteOne(query)
      res.send(result)
    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("task management")
})

app.listen(port, (req, res) => {
  console.log(`task management port,${port}`);
})