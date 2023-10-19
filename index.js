const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://techelectrohub28:lXu1i6rX4YnQkzSN@cluster0.uf2mbhw.mongodb.net/?retryWrites=true&w=majority";
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
    await client.connect();

    const productsCollection = client.db('productsDB').collection('products');
    const cartsCollection = client.db('productsDB').collection('carts');

    app.get('/products', async (req, res) => {
        const cursor = productsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        const result = await productsCollection.insertOne(newProduct);
        res.send(result);
    })

    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          type: updatedProduct.type,
          rating: updatedProduct.rating,
          price: updatedProduct.price,
          image: updatedProduct.image,
          description: updatedProduct.description
        }
      };
      const result = await productsCollection.updateOne(filter, product, options);
      res.send(result);
    })

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/carts', async (req, res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollection.findOne(query);
      res.send(result);
    })

    app.post('/carts', async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartsCollection.insertOne(cart);
      res.send(result);
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
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

app.get('/', async (req, res) => {
    res.send('TechElectroHub server is running...');
})

app.listen(port, () => {
    console.log(`TechElectroHub server is running on port ${port}`);
})