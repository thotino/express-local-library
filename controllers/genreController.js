const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");

exports.genreList = function(req, res) {
    Genre.find()
        .populate("genre")
        .sort([["name", "ascending"]])
        .exec(function(err, genres) {
            if(err) { return next(err); }
            res.render("genreList", {title : "Genre List", genreList: genres})
        });
    // res.send("");
};

exports.genreDetail = function(req, res, next) {
    async.parallel({
        genre: (callback) => {
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genreBooks: (callback) => {
            Book.find({"genre" : req.params.id})
                .exec(callback);
        },

    }, function(err, results) {
        if(err) { return next(err); }
        if(results.genre == null) {
            const err = new Error("Genre Not Found");
            err.status = 404;
            return next(err);
        }
        res.render("genreDetail", { title: "Genre Detail", genre: results.genre, genreBooks: results.genreBooks })
    });
};

exports.genreCreateGet = function(req, res) {
    res.send("");
};

exports.genreCreatePost = function(req, res) {
    res.send("");
};

exports.genreDeleteGet = function(req, res) {
    res.send("");
};

exports.genreDeletePost = function(req, res) {
    res.send("");
};

exports.genreUpdateGet = function(req, res) {
    res.send("");
};

exports.genreUpdatePost = function(req, res) {
    res.send("");
};
