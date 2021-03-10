const express = require("express");
const app = express();

const fs = require("fs");

const PORT = process.env.PORT || 3000;
let booksArray = require('./books');

app.get("/books", (req, res) => {
    fs.readFile('books.json', 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }
        booksArray = JSON.parse(data.toString());
    });
    res.status(200).json(booksArray.books);
});

app.get("/books/:id", (req, res) => {
    let bookId = req.params.id;
    let foundBook = booksArray.books.filter(book => book.id == bookId);
    res.status(200).json(foundBook.length === 0 ? "Book Not Found" : foundBook[0]);
})

app.post("/books/:name", (req, res) => {
    console.log(booksArray);
    let addedBook = {
        id: booksArray.books.length + 1,
        bookName: req.params.name
    }
    booksArray.books.push(addedBook);
    fs.writeFile('./books.json', JSON.stringify(booksArray, null, 4), (err) => {
        if (err) return console.log(err);
    });
    console.log(booksArray);
    res.status(200).send(addedBook);
})

app.listen(PORT);