const express = require("express");
const router = express.Router();
// auth middleware
const authmiddleware = require("../middleware/authmiddleware");

// question controller
const {
  // Add your question controller functions here
  // For example: get_questions, post_question, etc.
} = require("../controllers/questioncontrollers");

// Define your question routes here
// For example:
// router.get("/", authmiddleware, get_questions);
// router.post("/", authmiddleware, post_question);

module.exports = router;
