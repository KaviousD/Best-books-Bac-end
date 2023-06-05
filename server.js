'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bookSchema = require("./componets/books");
const { default: mongoose } = require('mongoose');
const bookmodel = require('./componets/books');


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

//connect to MongoDB
mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log(err.message)
  })

//defining the book schema


// Test book 
// const book = new bookSchema({
//   title: 'Sample',
//   author: 'Jhon burrow',
//   status: 'ongoing',

// })

// book.save()
//   .then(() => {
//     console.log('Sample book saved to the database');
//   })
//   .catch((err) => {
//     console.error('Error saving sample book:', err.message);
//   });

// Route handler for /books GET request
app.get('/books', (request, response) => {
  // Retrieve all books from the database
  bookmodel.find()
    .then((books) => {
      response.json(books);
    })
    .catch((err) => {
      console.error('Error retrieving books:', err.message);
      response.status(500).json({ error: 'Internal Server Error' });
    });
  response.send('book request received')
});

app.get('/test', (request, response) => {

  response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
