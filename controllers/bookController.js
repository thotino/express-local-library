"use strict";

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

exports.index = async function (req, res) {
  const [
    bookCount,
    bookInstanceCount,
    bookInstanceAvailableCount,
    authorCount,
    genreCount,
  ] = await Promise.all([
    Book.count({}),
    BookInstance.count({}),
    BookInstance.count({ status: "Available" }),
    Author.count({}),
    Genre.count({}),
  ]);
  const results = {
    bookCount,
    bookInstanceCount,
    bookInstanceAvailableCount,
    authorCount,
    genreCount,
  };
  res.render("index", {
    title: "Local Library Home",
    data: results,
  });
};

exports.bookList = async function (req, res, next) {
  const books = await Book.find({}, "title author").populate("author").exec();
  res.render("bookList", { title: "Book List", bookList: books });
};

exports.bookDetail = async function (req, res) {
  const [book, bookInstance] = await Promise.all([
    Book.findById(req.params.id).populate("author").populate("genre").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);
  res.render("bookDetail", {
    title: book.title,
    book: book,
    bookInstances: bookInstance,
  });
};

exports.bookCreateGet = async function (req, res, next) {
  const [authors, genres] = await Promise.all([Author.find(), Genre.find()]);
  res.render("bookForm", { title: "Create Book", authors, genres });
};
exports.bookCreatePost = async function (req, res, next) {
  const { title, author, summary, isbn, genre } = req.body;
  const book = new Book({ title, author, summary, isbn, genre });
  await book.save();
  const [authors, genres] = await Promise.all([Author.find(), Genre.find()]);
  res.render("bookForm", {
    title: "Create Book",
    authors,
    genres,
    book,
  });
  res.redirect(book.url);
};

exports.bookDeleteGet = function (req, res) {
  res.send("");
};

exports.bookDeletePost = function (req, res) {
  res.send("");
};

exports.bookUpdateGet = function (req, res) {
  res.send("");
};

exports.bookUpdatePost = function (req, res) {
  res.send("");
};
