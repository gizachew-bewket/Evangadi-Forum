// database connection
const dbconnection = require("../Database/databaseconfig");
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require("uuid");
async function get_all_questions(req, res) {
  try {
    const [rows] = await dbconnection.query(
      `SELECT questions.questionid, questions.userid, questions.title, questions.tag, questions.description,
              users.username, questions.created_at
       FROM questions
       INNER JOIN users ON questions.userid = users.userid
       ORDER BY questions.created_at ASC`
    );

    console.log("Rows ===========", rows);

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No questions found",
      });
    }

    res.status(200).json({
      status: "success",
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching questions",
      error: error.message,
    });
  }
}
async function get_single_question(req, res) {
  const { questionid } = req.params; // path variable

  // Validate questionid
  if (!questionid) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or missing question_id.",
    });
  }

  try {
    const [rows] = await dbconnection.query(
      `SELECT questions.questionid, questions.userid, questions.title, questions.tag, questions.description,
             users.username
      FROM questions
      INNER JOIN users ON questions.userid = users.userid
      WHERE questions.questionid = ?
    `,
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Question not found",
      });
    }

    // Return the single question
    res.status(200).json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while fetching the question",
      error: error.message,
    });
  }
}

async function post_question(req, res) {
  // const { title, tag, description } = req?.body;
  const title = req?.body?.title;
  const questionid = req?.body?.questionid;
  const tag = req?.body?.tag;
  const description = req?.body?.description;

  // 1. Validate request body
  if (!title || title.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Title is required.",
    });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Description is required.",
    });
  }

  if (!tag || tag.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Tag is required.",
    });
  }

  try {
    // 2. Insert new question
    const questionid = uuidv4();
    const [result] = await dbconnection.query(
      `INSERT INTO questions (questionid,userid, title, tag, description) VALUES (?,?, ?, ?, ?)`,
      [questionid, req.user.userid, title, tag, description]
    );

    // console.log("Result =================", result);

    // 3. Respond with 201 Created
    res.status(201).json({
      status: "success",
      message: "Question created successfully",
      data: {
        questionid: result.insertId,
        userid: req.user.id,
        title,
        tag,
        description,
      },
    });
  } catch (error) {
    console.error(error);
    // 4. Server error handling
    res.status(500).json({
      status: "error",
      message: "Server error while creating question",
      error: error.message,
    });
  }
}

module.exports = {
  get_all_questions,
  get_single_question,
  post_question,
};
