const express = require("express");
const router = express.Router();
const authmiddleware = require("../middleware/authmiddleware");

// answers controller
const {
  get_answers,
  post_answers,
} = require("../controllers/answercontrollers");

// get answers from a question
router.get("/:questionid", authmiddleware, get_answers);

// post an answer from a question
router.post("/", authmiddleware, post_answers);

module.exports = router;