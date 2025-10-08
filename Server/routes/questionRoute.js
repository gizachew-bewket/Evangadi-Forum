const express = require("express");
const router = express.Router();
// auth middleware
const authmiddleware = require("../middleware/authmiddleware");

// question controller
const {
  get_all_questions,
  get_single_question,
  post_question,
} = require("../controllers/questioncontrollers");

// get all questions
router.get("/", authmiddleware, get_all_questions);

// get single question
router.get("/:questionid", authmiddleware, get_single_question);

// post a question
router.post("", authmiddleware, post_question);

module.exports = router;
