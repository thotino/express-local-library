"use strict"
const BookInstance = require("../models/bookinstance")
const Book = require("../models/book")

exports.bookInstanceList = async function (req, res, next) {
    const bookInstances = await BookInstance.find().populate("book").exec()
    res.render("bookInstanceList", {
        title: "Book Instance List",
        bookInstances,
    })
}

exports.bookInstanceDetail = async function (req, res, next) {
    const bookInstance = await BookInstance.findById(req.params.id)
        .populate("book")
        .exec()
    if (!bookInstance) {
        const err = new Error("Book Copy Not Found")
        err.status = 404
        return next(err)
    }
    res.render("bookInstanceDetail", {
        title: "Copy: " + bookInstance.book.title,
        bookInstance,
    })
}

exports.bookInstanceCreateGet = async function (req, res, next) {
    const books = await Book.find({}, "title").exec()
    res.render("bookInstanceForm", {
        title: "Create BookInstance",
        bookList: books,
    })
}
exports.bookInstanceCreatePost = async function (req, res, next) {
    const bookInstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
    })
    await bookInstance.save()
    res.redirect(bookInstance.url)
}

exports.bookInstanceDeleteGet = function (req, res) {
    res.send("")
}

exports.bookInstanceDeletePost = function (req, res) {
    res.send("")
}

exports.bookInstanceUpdateGet = function (req, res) {
    res.send("")
}

exports.bookInstanceUpdatePost = function (req, res) {
    res.send("")
}
