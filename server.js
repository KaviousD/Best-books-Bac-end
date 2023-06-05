'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bookSchema = require("./componets/books");
const mongoose = require('mongoose');
// const bookmodel = require('./componets/books');


const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

let bookmodel = undefined
async function Seed() {

    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
    .then(()=>{console.log("Successfully connected")})

    const bookSchema = new mongoose.Schema({
        title: String,
        description: String,
        status: String,
        genre: String,
    })

    bookmodel = mongoose.model("book", bookSchema)


    const booksToInsert = [
        {
            title: 'book 1',
            author: 'author 1',
            genre: 'genre 1',
            status: 'ongoing',
        },
        {
            title: 'book 2',
            author: 'author 2',
            genre: 'genre 2',
            status: 'ongoing',
        },
        {
            title: 'book 3',
            author: 'author 3',
            genre: 'genre 3',
            status: 'ongoing',
        },
    ];

    // insert method to insertbooks to database

    await bookmodel.insertMany(booksToInsert)
        .then(() => {
            console.log('Books have been uploded')
        })
        .catch(() => {
            console.error('Error inserting za Books')
        });

}
Seed()

// Route handler for /books GET request
app.get('/books', async (request, response) => {
  // Retrieve all books from the database
  let allBooks = await bookmodel.find()
  response.send(allBooks)
});

app.get('/test', (request, response) => {

  response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
