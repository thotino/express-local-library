"use strict"

const mongoose = require("mongoose")
const logger = require("./logging")

class MongoDBConnector {
    #databaseURL
    #connection
    constructor(databaseURL) {
        this.#databaseURL = databaseURL
        this.#connection = null
    }
    async connect() {
        this.#connection = await mongoose
            .createConnection(this.#databaseURL)
            .asPromise()
        this.#connection.on("error", (err) => {
            logger.error(err)
        })
    }
    async close() {
        await this.#connection.close()
    }
}

module.exports = MongoDBConnector
