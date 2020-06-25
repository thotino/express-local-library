const Book = require("../models/book");

exports.index = function(req, res) {
    res.send("Site Home Page");
};

exports.bookList = function(req, res) {
    res.send("");
};

exports.bookDetail = function(req, res) {
    res.send("" + req.params.id);
};

exports.bookCreateGet = function(req, res) {
    res.send("");
};

exports.bookCreatePost = function(req, res) {
    res.send("");
};

exports.bookDeleteGet = function(req, res) {
    res.send("");
};

exports.bookDeletePost = function(req, res) {
    res.send("");
};

exports.bookUpdateGet = function(req, res) {
    res.send("");
};

exports.bookUpdatePost = function(req, res) {
    res.send("");
};
