"use strict";
const Author = require("../models/author");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

exports.authorList = function (req, res, next) {
  Author.find()
    .populate("author")
    .sort([["family_name", "ascending"]])
    .exec(function (err, authors) {
      if (err) {
        return next(err);
      }
      res.render("authorList", { title: "Author List", authorList: authors });
    });
  // res.send("");
};

exports.authorDetail = function (req, res, next) {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authorBooks: (callback) => {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        const err = new Error("Author Not Found");
        err.status = 404;
        return next(err);
      }
      res.render("authorDetail", {
        title: "Author Detail",
        author: results.author,
        authorBooks: results.authorBooks,
      });
    }
  );
};

exports.authorCreateGet = function (req, res) {
  res.render("authorForm", { title: "Create author" });
};

exports.authorCreatePost = [
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Family name must be specified")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  sanitizeBody("first_name").escape(),
  sanitizeBody("family_name").escape(),
  sanitizeBody("date_of_birth").toDate(),
  sanitizeBody("date_of_death").toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("authorForm", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(author.url);
      });
    }
  },
];

exports.authorDeleteGet = function (req, res, next) {
  async.parallel(
    {
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authorBooks: (callback) => {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        res.redirect("/catalog/authors");
      }
      res.render("authorDelete", {
        title: "Delete Author",
        author: results.author,
        authorBooks: results.authorBooks,
      });
    }
  );
};

exports.authorDeletePost = function (req, res) {
  res.send("");
};

exports.authorUpdateGet = function (req, res) {
  res.send("");
};

exports.authorUpdatePost = function (req, res) {
  res.send("");
};
