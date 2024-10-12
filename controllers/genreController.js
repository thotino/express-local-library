"use strict";
const Genre = require("../models/genre");
const Book = require("../models/book");

exports.genreList = async function (req, res) {
  const genres = await Genre.find()
    .populate("genre")
    .sort([["name", "ascending"]])
    .exec();
  res.render("genreList", { title: "Genre List", genreList: genres });
};

exports.genreDetail = async function (req, res, next) {
  const [genre, genreBooks] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }).exec(),
  ]);
  if (!genre) {
    const err = new Error("Genre Not Found");
    err.status = 404;
    return next(err);
  }
  res.render("genreDetail", {
    title: "Genre Detail",
    genre,
    genreBooks,
  });
};

exports.genreCreateGet = async function (req, res, next) {
  res.render("genreForm", { title: "Create Genre" });
};
exports.genreCreatePost = async function (req, res, next) {
  const genre = new Genre({ name: req.body.name });
  const existingGenre = Genre.findOne({ name: req.body.name }).exec();
  if (existingGenre) {
    res.redirect(existingGenre.url);
  } else {
    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.redirect(genre.url);
  }
};

exports.genreDeleteGet = function (req, res) {
  res.send("");
};

exports.genreDeletePost = function (req, res) {
  res.send("");
};

exports.genreUpdateGet = function (req, res) {
  res.send("");
};

exports.genreUpdatePost = function (req, res) {
  res.send("");
};
