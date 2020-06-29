const Author = require("../models/author");

exports.authorList = function(req, res, next) {
    Author.find()
        .populate("author")
        .sort([[ "family_name", "ascending" ]])
        .exec(function(err, authors) {
            if(err) {return next(err);}
            res.render("authorList", {title: "Author List", authorList: authors,});
        });
    // res.send("");
};

exports.authorDetail = function(req, res) {
    res.send("" + req.params.id);
};

exports.authorCreateGet = function(req, res) {
    res.send("");
};

exports.authorCreatePost = function(req, res) {
    res.send("");
};

exports.authorDeleteGet = function(req, res) {
    res.send("");
};

exports.authorDeletePost = function(req, res) {
    res.send("");
};

exports.authorUpdateGet = function(req, res) {
    res.send("");
};

exports.authorUpdatePost = function(req, res) {
    res.send("");
};
