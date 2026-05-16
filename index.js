const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors())
app.use (express.json())

const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function server() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
     
    const db = client.db("e-commerce")
    const productCollection = db.collection("products")

    app.get('/products',async (req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        //console.log(result);
        res.send(result)
})

app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const query = {_id: new ObjectId(productId)};
    const result = await productCollection.findOne(query);
  res.send(result)
})


app.post("/products", async (req,res) =>{
  const newProduct = req.body;
  const result = await productCollection.insertOne(newProduct);
  console.log(result);
  res.send(result)
});




app.delete('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const query = {_id: new ObjectId(productId)};
    const result = await productCollection.deleteOne(query);
  res.send(result)
})



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
   catch (error) {
    console.log(error);
  }
}
//run().catch(console.dir);

server().catch(console.dir)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
