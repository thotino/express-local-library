const BookInstance = require("../models/bookinstance");

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
    res.send("" + req.params.id);
};

exports.bookInstanceCreateGet = function(req, res) {
    res.send("");
};

exports.bookInstanceCreatePost = function(req, res) {
    res.send("");
};

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
