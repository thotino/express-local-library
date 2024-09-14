"use strict";
const async = require("async");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

exports.index = function (req, res) {
  async.parallel(
    {
      bookCount: (callback) => {
        Book.count({}, callback);
      },

      bookInstanceCount: (callback) => {
        // console.log("bookInstance");
        BookInstance.count({}, callback);
      },

      bookInstanceAvailableCount: (callback) => {
        // console.log("book available");
        BookInstance.count({ status: "Available" }, callback);
      },

      authorCount: (callback) => {
        // console.log("auth");
        Author.count({}, callback);
      },

      genreCount: (callback) => {
        // console.log("genre");
        Genre.count({}, callback);
      },
    },
    function (err, results) {
      console.log("HERE");

      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    }
  );
};

exports.bookList = function (req, res, next) {
  Book.find({}, "title author")
    .populate("author")
    .exec((err, books) => {
      if (err) {
        return next(err);
      }
      res.render("bookList", { title: "Book List", bookList: books });
    });
};

exports.bookDetail = function (req, res) {
  async.parallel(
    {
      book: (callback) => {
        Book.findById(req.params.id)
          .populate("author")
          .populate("genre")
          .exec(callback);
      },
      bookInstance: (callback) => {
        BookInstance.find({ book: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.book == null) {
        const err = new Error("Book Not Found");
        err.status = 404;
        return next(err);
      }
      res.render("bookDetail", {
        title: results.book.title,
        book: results.book,
        bookInstances: results.bookInstance,
      });
    }
  );
  // res.send("" + req.params.id);
};

exports.bookCreateGet = function (req, res, next) {
  async.parallel(
    {
      authors: (callback) => {
        Author.find(callback);
      },
      genres: (callback) => {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("bookForm", {
        title: "Create Book",
        authors: results.authors,
        genres: results.genres,
      });
    }
  );
  // res.send("");
};

exports.bookCreatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
      // req.body.genre = [];
      next();
    }
  },
  body("title", "Title must not be empty").trim().isLength({ min: 1 }),
  body("author", "Author must not be empty").trim().isLength({ min: 1 }),
  body("summary", "Summary must not be empty").trim().isLength({ min: 1 }),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }),

  sanitizeBody("*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          authors: (callback) => {
            Author.find(callback);
          },
          genres: (callback) => {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = "true";
            }
          }
          res.render("bookForm", {
            title: "Create Book",
            authors: results.authors,
            genres: results.genres,
            book: book,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      book.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(book.url);
      });
    }
  },
];

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
