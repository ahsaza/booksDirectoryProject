const express = require("express");
const app = express();
const fs = require("fs");
const PORT = process.env.PORT || 3000;

const readBooksJSON = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    catch (err) { throw err };
}

const WriteToBooksJSON = (filePath, data) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 4), (err) => {
        if (err) return console.log(err);
    });
}

app.get("/books", (req, res) => {
    const booksJson = readBooksJSON("./books.json");
    res.status(200).json(booksJson["books"]);
});

app.get("/books/:id", (req, res) => {
    let bookId = req.params.id;
    const booksJson = readBooksJSON("./books.json");
    let foundBook = booksJson.books.length > 0 ? booksJson.books.filter(book => book.id == bookId) : [];
    res.status(200).json(foundBook.length === 0 ? "Book Not Found" : foundBook[0]);
})

app.post("/books/:name", (req, res) => {
    const booksJson = readBooksJSON("./books.json");
    let addedBook = {
        id: booksJson.books.length > 0 ? booksJson.books[booksJson.books.length - 1].id + 1 : 1,
        bookName: req.params.name
    }
    booksJson.books.push(addedBook);
    WriteToBooksJSON("./books.json", booksJson);
    res.status(200).send(addedBook);
});

app.delete("/books/:id", (req, res) => {
    const booksJson = readBooksJSON("./books.json");
    booksJson.books = booksJson.books.filter(book => req.params.id != book.id);
    WriteToBooksJSON("./books.json", booksJson);
    res.status(200).send("Book Deleted Succesfuly");
})

app.put("/books", (req, res) => {
    let { bookId, bookNewName } = req.query;
    const booksJson = readBooksJSON("./books.json");
    if (!bookId || !bookNewName) return res.status(400).send("bookId & bookNewName is Mandatory"); 
    booksJson.books.forEach(book => {
        book.id == bookId ? book.bookName = bookNewName : "";
    });
    WriteToBooksJSON("./books.json", booksJson);
    res.status(200).send("Book Edited Succisfuly");
})

app.listen(PORT);