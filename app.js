const express = require("express");
const app = express();
const books = require("./router/books");
const PORT = process.env.PORT || 3000;

app.use("/books", books);

app.listen(PORT);