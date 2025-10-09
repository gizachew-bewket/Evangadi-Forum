// database connection
const dbconnection = require("../Database/databaseconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, firstname, lastname, email, user_password } = req.body;

  // Validation
  if (!username || !firstname || !lastname || !email || !user_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (user_password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await dbconnection.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists with this email or username" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insert new user
    const [result] = await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, user_password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      userid: result.insertId,
      username: username
    });

  } catch (error) {
    console.error("Error registering user:", error);
    console.error("Error details:", error.message);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
}

async function login(req, res) {
  const { email, user_password, rememberMe } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is empty" });
  }
  if (!user_password) {
    return res.status(400).json({ message: "password is empty" });
  }

  try {
    const [rows] = await dbconnection.query(
      "SELECT username,userid,user_password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(
      user_password,
      user.user_password
    );

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const username = rows[0].username;
    const userid = rows[0].userid;

    const expiresIn = rememberMe ? "30d" : "1d";

    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: expiresIn,
    });

    return res.status(200).json({
      msg: "user login successful",
      token,
      username,
      userid, //  OPTIONAL: Make sure you return userid too
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function checkuser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.json({ message: "user is logged in", username, userid });
}
module.exports = {
  register,
  login,
  checkuser,
};
