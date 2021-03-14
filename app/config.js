const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  secretKey: process.env.secretKey,
  serviceName: process.env.serviceName,
  //----- konfigurasi database ----//
  dbHost: process.env.dbHost,
  dbUser: process.env.dbUser,
  dbPass: process.env.dbPass,
  dbName: process.env.dbName,
};
