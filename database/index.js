const mongoose = require("mongoose");
const { dbHost, dbName, dbPort, dbUser, dbPass } = require("../app/config");
mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);
const db = mongoose.connection;
module.exports = db;
