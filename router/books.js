const express = require("express");
const router = express.Router();
const fs = require("fs");

const booksJsonPath = "./books.json";

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

router.get("/", (req, res) => {
    const booksJson = readBooksJSON(booksJsonPath);
    res.status(200).json(booksJson["books"]);
});

router.get("/:id", (req, res) => {
    let bookId = req.params.id;
    const booksJson = readBooksJSON(booksJsonPath);
    let foundBook = booksJson.books.length > 0 ? booksJson.books.filter(book => book.id == bookId) : [];
    res.status(200).json(foundBook.length === 0 ? "Book Not Found" : foundBook[0]);
})

router.post("/:name", (req, res) => {
    const booksJson = readBooksJSON(booksJsonPath);
    let addedBook = {
        id: booksJson.books.length > 0 ? booksJson.books[booksJson.books.length - 1].id + 1 : 1,
        bookName: req.params.name
    }
    booksJson.books.push(addedBook);
    WriteToBooksJSON(booksJsonPath, booksJson);
    res.status(200).send(addedBook);
});

router.delete("/:id", (req, res) => {
    const booksJson = readBooksJSON(booksJsonPath);
    booksJson.books = booksJson.books.filter(book => req.params.id != book.id);
    WriteToBooksJSON("./books.json", booksJson);
    res.status(200).send("Book Deleted Succesfuly");
})

router.put("/", (req, res) => {
    let { bookId, bookNewName } = req.query;
    const booksJson = readBooksJSON(booksJsonPath);
    if (!bookId || !bookNewName) return res.status(400).send("bookId & bookNewName is Mandatory");
    booksJson.books.forEach(book => {
        book.id == bookId ? book.bookName = bookNewName : "";
    });
    WriteToBooksJSON(booksJsonPath, booksJson);
    res.status(200).send("Book Edited Succisfuly");
})

module.exports = router;