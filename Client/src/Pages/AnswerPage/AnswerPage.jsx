import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import "./AnswerPage.css";
import { FaUserCircle } from "react-icons/fa";
import { Appstate } from "../Appstate";

const AnswerPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(Appstate);
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axiosInstance.get("/user/checkUser", {
          headers: { Authorization: "Bearer " + token },
        });

        setUser({
          username: res.data.username,
          userid: res.data.userid,
        });
      } catch (err) {
        console.error("User not authenticated:", err);
        navigate("/login");
      }
    };

    verifyUser();
  }, [user, navigate, setUser]);

  // Fetch question + answers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const qRes = await axiosInstance.get(`/question/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestion(qRes.data.data);

        const aRes = await axiosInstance.get(`/answer/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnswers(Array.isArray(aRes.data.data) ? aRes.data.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load answers");
      }
    };
    fetchData();
  }, [id]);

  // Post a new answer
  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        "/answer",
        { questionid: id, answer: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnswers([res.data.data, ...answers]);
      setNewAnswer("");
      setMessage(" Answer posted successfully!");
      setError("");

      // clear success message after 3 sec
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error posting answer:", err);
      setError(" Failed to post answer");
    }
  };

  return (
    <div className="answer-container">
      {question && (
        <div className="question-box">
          <h3>QUESTION</h3>
          <h4 className="question-title">{question.title}</h4>
          <p className="question-description">{question.description}</p>
        </div>
      )}

      <h3 className="answers-header">
        Answer From The Community({answers.length})
      </h3>

      {/* Success/Error messages */}
      {message && (
        <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="answers-list">
        {answers.length > 0 ? (
          answers.map((ans) => (
            <div key={ans.answerid} className="answer-card">
              <FaUserCircle className="user-icon" />
              <div className="answer-content">
                <span className="username">{ans.username}</span>
                <p>{ans.answer}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No answers yet. Be the first to answer!</p>
        )}
      </div>

      <div className="answer-form">
        <textarea
          placeholder="Your answer ..."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button onClick={handlePostAnswer}>Post Answer</button>
        {/* {message && <p className="msg">{message}</p>} */}
      </div>
    </div>
  );
};

export default AnswerPage;
