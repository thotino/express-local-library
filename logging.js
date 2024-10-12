"use strict";

const winston = require("winston");
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.label(),
    winston.format.splat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
