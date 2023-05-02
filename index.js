const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.DB;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let todoCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    todoCollection = client.db('mydb').collection('todos');
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

app.get('/todos', async (req, res) => {
  const todos = await todoCollection.find().toArray();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
    const result = await todoCollection.insertOne(req.body);
    res.json(result);
});
  

app.delete('/todos/:id', async (req, res) => {
  const result = await todoCollection.deleteOne({ _id: req.params.id });
  res.json({ message: 'Todo deleted successfully.' });
});

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
