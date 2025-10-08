// database connection
const dbconnection = require("../Database/databaseconfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function register(req, res) {
  const { username, firstname, lastname, email, user_password } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Please Enter Your User Name" });
  }
  if (!firstname) {
    return res.status(400).json({ message: "Please Enter Your firstname" });
  }
  if (!lastname) {
    return res.status(400).json({ message: "Please Enter Your lastname" });
  }
  if (!email) {
    return res.status(400).json({ message: "Please Enter Your email" });
  }
  if (!user_password) {
    return res.status(400).json({ message: "Please Enter Your password" });
  }

  try {
    const [usernameValidation] = await dbconnection.query(
      "SELECT * FROM users WHERE username= ?",
      [username]
    );

    const [emailValidation] = await dbconnection.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (usernameValidation.length > 0) {
      return res
        .status(400)
        .json({ status: "Failed ", message: "Username Already Exists" });
    }

    if (emailValidation.length > 0) {
      return res
        .status(400)
        .json({ status: "Failed ", message: "Email Already in Use" });
    }

    if (user_password.length <= 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, user_password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
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
