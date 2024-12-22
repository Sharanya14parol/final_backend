// const mysql = require("mysql2");

// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "shashwath_09",
//   database: "exam_db",
// });

// // Establish the connection
// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database: ", err.stack);
//     return;
//   }
//   console.log("Connected to the database with ID: " + connection.threadId);
// });

// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'shashwath_09',
//     database: 'exam_db',
// });

// module.exports = pool;

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "shashwath_09",
  database: "exam_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
