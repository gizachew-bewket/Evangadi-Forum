// database connection
const dbconnection = require("../Database/databaseconfig");

async function get_answers(req, res) {
  const { questionid } = req.params;

  // 1. Validate questionid exists
  if (!questionid) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or missing questionid.",
    });
  }

  try {
    // 2. Fetch answers with user info
    const [rows] = await dbconnection.query(
      `SELECT answers.answerid, answers.userid, answers.answer, users.username
       FROM answers
       INNER JOIN users ON answers.userid = users.userid
       WHERE answers.questionid = ?`,
      [questionid]
    );

    // 3. Handle case when no answers found
    if (rows.length === 0) {
      return res.status(200).json({
        status: "success",
        questionid,
        total_answers: 0,
        data: [],
        message: "No answers found for this question",
      });
    }

    // 4. Respond with JSON payload
    res.status(200).json({
      status: "success",
      questionid,
      total_answers: rows.length,
      data: rows, // array of answers with userid and username
    });
  } catch (error) {
    console.error(error);
    // 5. General error handling
    res.status(500).json({
      status: "error",
      message: "Server error while fetching answers",
      error: error.message,
    });
  }
}

// post answers
async function post_answers(req, res) {
  try {
    const { questionid, answer } = req.body;
    const userid = req.user.userid; // from authmiddleware

    if (!userid || !questionid || !answer) {
      return res.status(400).json({
        status: "error",
        message: "userid, questionid, and answer are required",
      });
    }

    // 1. Check if the question exists
    const [questionRows] = await dbconnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (questionRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Cannot post answer: question does not exist",
      });
    }

    // 2. Insert the answer
    const [result] = await dbconnection.query(
      `INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)`,
      [userid, questionid, answer]
    );

    // 3. Respond with the inserted answer
    res.status(201).json({
      status: "success",
      message: "Answer posted successfully",
      data: {
        answerid: result.insertId, // AUTO_INCREMENT
        userid,
        questionid,
        answer,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server error while creating answer",
      error: error.message,
    });
  }
}

module.exports = {
  get_answers,
  post_answers,
};
