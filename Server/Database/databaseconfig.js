const mysql2 = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const dbconnection = mysql2.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'Evangadi',
  password: process.env.DB_PASSWORD || 'Evangadi@2025!',
  database: process.env.DB_NAME || 'Evangadi-forum-db',
});

// Add error handling for database connection
dbconnection.on('error', (err) => {
  console.error('Database connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  } else {
    console.error('Database error:', err);
  }
});
// dbconnection.connect((err) => {
//   if (err) {
//     console.error("DB connection failed:", err);
//     return;
//   }
//   console.log("Connected to MySQL2 database!");
// });
// console.log(process.env.JWT_SECRET);

module.exports = dbconnection.promise();
// export default dbconnection.promise();
