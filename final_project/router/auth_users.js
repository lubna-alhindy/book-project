const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  for (let user of users) {
    if (username === user.userName) {
      return false;
    }
  }
  return true;
};

const authenticatedUser = (username, password) => {
  for (let user of users) {
    if (user.userName === username && user.password === password) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (!authenticatedUser(userName, password)) {
    return res
      .status(400)
      .json({ message: "Invalid Login. Check username and password" });
  }

  let accessToken = jwt.sign(
    {
      userName: userName,
    },
    "bookssecrete"
  );

  req.session.authorization = {
    accessToken,
  };

  return res.status(200).json({
    message: "Customer successfully logged in",
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userName = req.user.userName;
  const isbn = req.params.isbn;
  const review = req.query.review;

  for (let i in books) {
    if (i === isbn) {
      books[i].reviews[`${userName}`] = review;
      break;
    }
  }

  return res.status(201).json({ message: `the review for the book with ISBN ${isbn} has been added/updated` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const userName = req.user.userName;
  const isbn = req.params.isbn;

  for (let i in books) {
    if (i === isbn) {
      books[i].reviews[`${userName}`] = undefined;
      break;
    }
  }

  return res.status(200).json({ message: `Reviews for the ISBN ${isbn} posted by the user ${userName} deleted` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
