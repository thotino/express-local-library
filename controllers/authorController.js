"use strict"
const Author = require("../models/author")
const Book = require("../models/book")

exports.authorList = async function (req, res, next) {
    const authors = await Author.find()
        .populate("author")
        .sort([["family_name", "ascending"]])
        .exec()
    res.render("authorList", { title: "Author List", authorList: authors })
}

exports.authorDetail = async function (req, res, next) {
    const [author, authorBooks] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ])
    res.render("authorDetail", {
        title: "Author Detail",
        author,
        authorBooks,
    })
}

exports.authorCreateGet = async function (req, res) {
    res.render("authorForm", { title: "Create author" })
}

exports.authorCreatePost = async function (re, res, next) {
    const { first_name, family_name, date_of_birth, date_of_death } = req.body
    const author = new Author({
        first_name,
        family_name,
        date_of_birth,
        date_of_death,
    })
    await author.save()
    res.redirect(author.url)
}

exports.authorDeleteGet = async function (req, res, next) {
    const [author, authorBooks] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }).exec(),
    ])
    if (author == null) {
        res.redirect("/catalog/authors")
    }
    res.render("authorDelete", {
        title: "Delete Author",
        author,
        authorBooks,
    })
}

exports.authorDeletePost = function (req, res) {
    res.send("")
}

exports.authorUpdateGet = function (req, res) {
    res.send("")
}

exports.authorUpdatePost = function (req, res) {
    res.send("")
}
