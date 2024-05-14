const mysql = require("mysql2/promise");
require("dotenv").config;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "mingle_sphere",
  password: process.env.MYSQL_PASSWORD,
  waitForConnections: true,
  multipleStatements: true,
});

module.exports = { pool };
