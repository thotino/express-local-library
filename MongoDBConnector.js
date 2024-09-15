"use strict";
const mongoose = require("mongoose");

// const mongoDB = "mongodb://127.0.0.1/local-library-database";
// mongoose.connect(mongoDB, { useNewUrlParser: true });

// const database = mongoose.connection;
// database.on(
//   "error",
//   console.error.bind(console, "MongoDB connection error : ")
// );

class MongoDBConnector {
  #databaseURL;
  #connection;
  constructor(databaseURL) {
    this.#databaseURL = databaseURL;
  }
  async connect() {
    this.#connection = await mongoose.createConnection(this.#databaseURL);
  }
  async close() {
    await this.#connection.close();
  }
}

module.exports = MongoDBConnector;
