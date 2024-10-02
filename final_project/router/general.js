const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  if (req.body.username && req.body.password) {
    users.push({ username: req.body.username, password: req.body.password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
  } else {
    return res.status(401).json({ message: "Username and password are not provided" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json({ success: true, data: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const book = books[req.params.isbn];
  res.status(200).json({ book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let booksbyauthor = [];
  for (const key in books) {
    if (books[key]['author'] === req.params.author) {
      booksbyauthor.push(books[key])
    };
  }
  return res.status(200).json({ booksbyauthor });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let booksbytitle = [];
  for (const key in books) {
    if (books[key]['title'] === req.params.title) {
      booksbytitle.push(books[key])
    };
  }
  return res.status(200).json({ booksbytitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const review = books[req.params.isbn]['review'];
  return res.status(200).json({ review });
});

// Task 10-13 common function
const getBooksListWithPromise = async (url) => {
  try {
    const data = await axios.get(url);
    return data.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Task 10
public_users.get('/promise', async (req, res) => {
  try {
    const books = await getBooksListWithPromise("http://localhost:5000/");
    res.status(200).json({ ...books });
  } catch (error) {
    console.log("error in get all books with promise" + error.message)
    res.status(500).json({ message: "Server Error" });
  }
});

// Task 11
public_users.get('/promise/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = await getBooksListWithPromise(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json({ ...book });
  } catch (error) {
    console.log("error in get book with ibsn " + error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Task 12
public_users.get('/promise/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const books = await getBooksListWithPromise(`http://localhost:5000/author/${author}`);
    res.status(200).json({ ...books });
  } catch (error) {
    console.log('error in get books with author ' + error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Task 13
public_users.get('/promise/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const books = await getBooksListWithPromise(`http://localhost:5000/title/${title}`);
    res.status(200).json({ ...books });
  } catch (error) {
    console.log('error in get books with title ' + error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports.general = public_users;
