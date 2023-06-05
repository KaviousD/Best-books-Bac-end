const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: String,
    genre: String,
})

const bookmodel = mongoose.model("book",bookSchema)

const book1= new bookmodel({
    title: 'book 1',
    author: 'author 1',
    genre: 'genre 1',
    status: 'ongoing',
})

const book2= new bookmodel({
    title: 'book 2',
    author: 'author 2',
    genre: 'genre 2',
    status: 'ongoing',
})

const book3= new bookmodel({
    title: 'book 3',
    author: 'author 3',
    genre: 'genre 3',
    status: 'ongoing',
})

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

bookmodel.insertMany(booksToInsert)
.then(() => {
    console.log('Books have been uploded')
})
.catch (() => {
    console.error('Error inserting za Books')
});

module.exports = bookmodel;