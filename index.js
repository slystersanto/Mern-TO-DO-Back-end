const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
   
    res.setHeader('Access-Control-Allow-Origin', 'https://chic-rolypoly-fc9eb3.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

const DB = process.env.DB;
const client = new MongoClient(DB, { useNewUrlParser: true, useUnifiedTopology: true });

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


app.get('/', (req, res) => {
    res.send('Welcome to Deployment Practice Backend and Frontend Connectivity!');
});

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
