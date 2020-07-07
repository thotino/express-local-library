const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const { sanitizeBody, validationResult } = require("express-validator");
const { body } = require("express-validator/check");

exports.bookInstanceList = function(req, res, next) {
    BookInstance.find()
        .populate("book")
        .exec((err, bookInstances) => {
            if(err) {return next(err);}
            res.render("bookInstanceList", {
                title: "Book Instance List",
                bookInstances: bookInstances,
            });
        });
};

exports.bookInstanceDetail = function(req, res) {
    BookInstance.findById(req.params.id)
        .populate("book")
        .exec((err, bookInstance) => {
            if(err) { return next(err); }
            if(bookInstance == null) {
                const err = new Error("Book Copy Not Found");
                err.status = 404;
                return next(err);
            }
            res.render("bookInstanceDetail", { 
                title: "Copy: " + bookInstance.book.title, 
                bookInstance: bookInstance
            });
        });
};

exports.bookInstanceCreateGet = function(req, res, next) {
    Book.find({}, "title").exec(function(err, books) {
        if(err) { return next(err); }
        res.render("bookInstanceForm", {
            title: "Create BookInstance",
            bookList: books,
        });
    });
};

exports.bookInstanceCreatePost = [
    body("book", "Book must be specified").trim().isLength({ min: 1 }),
    body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }),
    body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody("book").escape(),
    sanitizeBody("imprint").escape(),
    sanitizeBody("status").trim().escape(),
    sanitizeBody("due_back").toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        const bookInstance = new BookInstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
        });

        if(!errors.isEmpty()) {
            Book.find({}, "title").exec(function(err, books) {
                if(err) { return next(err); }
                res.render("bookInstanceForm", {
                    title: "Create BookInstance",
                    bookList: books,
                    selectedBook: bookInstance.book._id,
                    errors: errors.array(),
                    bookInstance: bookInstance,
                });
            });
        } else {
            bookInstance.save((err) => {
                if(err) { return next(err); }
                res.redirect(bookInstance.url);
            });
        }
    },
];

exports.bookInstanceDeleteGet = function(req, res) {
    res.send("");
};

exports.bookInstanceDeletePost = function(req, res) {
    res.send("");
};

exports.bookInstanceUpdateGet = function(req, res) {
    res.send("");
};

exports.bookInstanceUpdatePost = function(req, res) {
    res.send("");
};
