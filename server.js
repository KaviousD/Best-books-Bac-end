'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bookSchema = require('./componets/books');
const mongoose = require('mongoose');
const axios = require('axios');
const verifyUser = require('./componets/verifyUser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyUser);

const PORT = process.env.PORT || 3001;


async function Seed() {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
        .then(() => {
            console.log('Successfully connected');
        })
        .catch((error) => {
            console.error('Error connecting to the database:', error);
        });

    const bookSchema = new mongoose.Schema({
        title: String,
        description: String,
        status: String,
        genre: String,
    });

    let bookmodel = mongoose.model("book", bookSchema);

    const booksToInsert = [
        {
            title: 'book 1',
            author: 'author 1',
            genre: 'genre 1',
            status: 'ongoing',
            email: 'email1@example.com',
        },
        {
            title: 'book 2',
            author: 'author 2',
            genre: 'genre 2',
            status: 'ongoing',
            email: 'email2@example.com',
        },
        {
            title: 'book 3',
            author: 'author 3',
            genre: 'genre 3',
            status: 'ongoing',
            email: 'email3@example.com',
        },
    ];

    await bookmodel.insertMany(booksToInsert)
        .then(() => {
            console.log('Books have been uploaded');
        })
        .catch((error) => {
            console.error('Error inserting books:', error);
        });
}

Seed();

// Route handler for /books GET request
app.get('/books/:email', async (request, response) => {
    const userEmail = request.params.email;

    try {
        const books = await bookmodel.find({ email: userEmail });
        response.send(books);
    } catch (error) {
        console.error('Error retrieving books:', error);
        response.status(500).json({ message: 'Failed to retrieve books' });
    }
});

// Route handler for /books POST request
app.post('/books', async (request, response) => {
    const { title, description, status, genre, email } = request.body;

    const newBook = new bookmodel({
        title,
        description,
        status,
        genre,
        email, 
    });

    try {
        await newBook.save();
        response.status(201).json({ message: 'Book created successfully' });
    } catch (error) {
        console.error('Error creating book:', error);
        response.status(500).json({ message: 'Failed to create the book' });
    }
});


// Route handler for /books PUT request
app.put('/books/:id', async (request, response) => {
    const bookId = request.params.id;
    const { title, description, status, genre } = request.body;

    await bookmodel.findByIdAndUpdate(
        bookId,
        { title, description, status, genre },
        { new: true }
    )
        .then((updatedBook) => {
            if (updatedBook) {
                response.status(200).json({ message: 'Book updated successfully' });
            } else {
                response.status(404).json({ message: 'Book not found' });
            }
        })
        .catch((error) => {
            console.error('Error updating the book:', error);
            response.status(500).json({ message: 'Failed to update the book' });
        });
});

// Route handler for /books DELETE request
app.delete('/books/:id', async (request, response) => {
    const bookId = request.params.id;

    await bookmodel.findByIdAndRemove(bookId)
        .then(() => {
            response.status(200).json({ message: 'Book deleted successfully' });
        })
        .catch((error) => {
            console.error('Error deleting the book:', error);
            response.status(500).json({ message: 'Failed to delete the book' });
        });
});
