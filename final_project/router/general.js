const express = require("express");
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: "username &/ password are not provided" });
  }
  if (!isValid(userName))
    return res.status(404).json({ message: "username already exist" });

  users.push({
    userName: userName,
    password: password,
  });
  return res.status(201).json({
    message: "Customer successfully registered, Now ypu can login",
  });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  return res.status(200).json({ books: books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const book = await Object.values(books)[isbn - 1];
  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const allBook = await Object.keys(books);
  let response = [];
  for (let i of allBook) {
    if (books[i].author === author) response.push(books[i]);
  }
  return res.status(200).json({ booksbyauthor: response });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const allBook = await Object.keys(books);
  let response = [];
  for (let i of allBook) {
    if (books[i].title === title) response.push(books[i]);
  }
  return res.status(200).json({ booksbytitle: response });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books)[isbn - 1];

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
