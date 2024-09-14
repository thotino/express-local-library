"use strict";
const mongoose = require("mongoose");

const mongoDB = "mongodb://127.0.0.1/local-library-database";
mongoose.connect(mongoDB, { useNewUrlParser: true });

const database = mongoose.connection;
database.on(
  "error",
  console.error.bind(console, "MongoDB connection error : ")
);
