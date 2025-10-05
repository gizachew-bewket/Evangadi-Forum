const express = require("express");
const cors = require("cors");
const app = express();
PORT = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// database connection
const dbconnection = require("./Database/databaseconfig");

async function start() {
  try {
    await dbconnection;
    console.log("✅ Connected to MySQL2 database!");

    app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
  }
}
start();
