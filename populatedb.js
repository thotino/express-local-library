#! /usr/bin/env node
"use strict"
console.log(
    "This script populates some test books, authors, genres and bookinstances to your database. \
  Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true"
)

// Get arguments passed on command line
const userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

```sh
docker pull mongodb/mongodb-community-server:latest
docker run -it -p 27017:27017 --name mongodb -d mongodb/mongodb-community-server:latest
```;
*/
const databaseURL = "mongodb://127.0.0.1:27017/local-mongo"
const Book = require("./models/book")
const Author = require("./models/author")
const Genre = require("./models/genre")
const BookInstance = require("./models/bookinstance")

const MongoDBConnector = require("./MongoDBConnector")
const logger = require("./logging")

const mongoDBConnector = new MongoDBConnector(databaseURL)

const authors = []
const genres = []
const books = []
const bookInstances = []

async function createAuthor(firstName, familyName, birthDate, deathDate) {
    const authorDetail = { first_name: firstName, family_name: familyName }
    if (birthDate != false) authorDetail.date_of_birth = birthDate
    if (deathDate != false) authorDetail.date_of_death = deathDate

    const author = new Author(authorDetail)

    await author.save()
    authors.push(author)
}

async function createGenre(name) {
    const genre = new Genre({ name })

    await genre.save()
    genres.push(genre)
}

async function createBook(title, summary, isbn, author, genre) {
    const bookDetail = {
        title: title,
        summary: summary,
        author: author,
        isbn: isbn,
    }
    if (genre != false) bookDetail.genre = genre

    const book = new Book(bookDetail)
    await book.save()
    books.push(book)
}

async function createBookInstance(book, imprint, dueBack, status) {
    const bookInstanceDetail = {
        book: book,
        imprint: imprint,
    }
    if (dueBack != false) bookInstanceDetail.due_back = dueBack
    if (status != false) bookInstanceDetail.status = status

    const bookInstance = new BookInstance(bookInstanceDetail)
    await bookInstance.save()
    bookInstances.push(bookInstance)
}

async function createGenreAuthors() {
    logger.info("Creating authors and genres")
    await Promise.all([
        createAuthor("Patrick", "Rothfuss", "1973-06-06", false),
        createAuthor("Ben", "Bova", "1932-11-8", false),
        createAuthor("Isaac", "Asimov", "1920-01-02", "1992-04-06"),
        createAuthor("Patrick", "Rothfuss", "1973-06-06", false),
        createAuthor("Ben", "Bova", "1932-11-8", false),
        createAuthor("Isaac", "Asimov", "1920-01-02", "1992-04-06"),
        createAuthor("Bob", "Billings", false, false),
        createAuthor("Jim", "Jones", "1971-12-16", false),
        createGenre("Fantasy"),
        createGenre("Science Fiction"),
        createGenre("French Poetry"),
    ])
}

async function createBooks() {
    logger.info("Creating books...")
    await Promise.all([
        createBook(
            "The Name of the Wind (The Kingkiller Chronicle, #1)",
            "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
            "9781473211896",
            authors[0],
            [genres[0]]
        ),
        createBook(
            "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
            "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
            "9788401352836",
            authors[0],
            [genres[0]]
        ),
        createBook(
            "The Slow Regard of Silent Things (Kingkiller Chronicle)",
            "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
            "9780756411336",
            authors[0],
            [genres[0]]
        ),
        createBook(
            "Apes and Angels",
            "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
            "9780765379528",
            authors[1],
            [genres[1]]
        ),
        createBook(
            "Death Wave",
            "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
            "9780765379504",
            authors[1],
            [genres[1]]
        ),
    ])
}

async function createBookInstances() {
    logger.info("Creating book instances...")
    await Promise.all([
        createBookInstance(
            books[0],
            "London Gollancz, 2014.",
            false,
            "Available"
        ),
        createBookInstance(books[1], " Gollancz, 2011.", false, "Loaned"),
        createBookInstance(books[2], " Gollancz, 2015.", false, false),
        createBookInstance(
            books[3],
            "New York Tom Doherty Associates, 2016.",
            false,
            "Available"
        ),
        createBookInstance(
            books[3],
            "New York Tom Doherty Associates, 2016.",
            false,
            "Available"
        ),
        createBookInstance(
            books[3],
            "New York Tom Doherty Associates, 2016.",
            false,
            "Available"
        ),
        createBookInstance(
            books[4],
            "New York, NY Tom Doherty Associates, LLC, 2015.",
            false,
            "Available"
        ),
        createBookInstance(
            books[4],
            "New York, NY Tom Doherty Associates, LLC, 2015.",
            false,
            "Maintenance"
        ),
        createBookInstance(
            books[4],
            "New York, NY Tom Doherty Associates, LLC, 2015.",
            false,
            "Loaned"
        ),
    ])
}
async function main() {
    await mongoDBConnector.connect()
    await createGenreAuthors()
    await createBooks()
    await createBookInstances()
    await mongoDBConnector.close()
    process.exit(0)
}

main().catch((err) => {
    logger.error(err.message)
    process.exit(1)
})
