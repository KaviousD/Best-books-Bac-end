'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bookSchema = require("./componets/books");
const mongoose = require('mongoose');
// const bookmodel = require('./componets/books');


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
//Ray question do i add the render link her aswell to get the thing to display

let bookmodel = undefined
async function Seed() {

    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
        .then(() => { console.log("Successfully connected") })

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

// Route handeler for /books Post request
app.post('/books', async (request, response) => {
    // Details for book
    const { title, description, status, genre } = request.body;

    // creating new book from info above
    const newBook = new bookmodel({
        title,
        description,
        status,
        genre,
    });

    await newBook
        .save()
        .then(() => {
            response.status(201).json({ message: 'book created sucess' });
        })
        .catch((error) => {
            console.error('Error creating book:', error);
            response.status(500).json({ message: ' Failed to create the book' });
        });
});

//Creating route for /books PUT req.
app.put('/books/:id', async (request, response) => {
    const bookId = request.params.id; // prams means the prams = /book
    const { title, description, status, genre } = request.body;

    await bookmodel
        .findByIdAndUpdate(
            bookId,
            { title, description, status, genre },
            { new: true }
        )
        .then((UpdatedBook) => {
            if (UpdatedBook) {
                response.status(200).json({ message: 'Book deleted successfully' });
            } else {
                response.status(404).json({ mesage: 'Book not found' });
            }
        })
        .catch((error) => {
            console.error('Error updating the book', error);
            response.status(500).json({ message: 'Failed to update the book' });
        });
});

 // route handeler or /books delete request
app.delete('/books/:id', async (request, response) => {
    const bookId = request.params.id;

    await bookmodel
    .findByIdAndRemove(bookId)
    .then(() => {
        response.status(200).json({message: 'book deleted sucessfully'});
    })
    .catch((error) => {
        console.error('Error deleting the book:', error);
        response.status(500).json({message: 'Failed to delete the book'});
    });
});





app.get('/test', (request, response) => {

    response.send('test request received')

})

app.listen(PORT, () => console.log(`listening on ${PORT}`));
