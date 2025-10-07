import React, { useContext, useState, useEffect } from "react";
import { Appstate } from "../Appstate";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(Appstate);

  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // 👈 initially show 5

  useEffect(() => {
    if (!user?.username) {
      const savedUsername = localStorage.getItem("username");
      const savedUserid = localStorage.getItem("userid");
      if (savedUsername) {
        setUser({ username: savedUsername, userid: savedUserid });
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/question", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        // Show newest first
        setQuestions(res.data.data.reverse());
      } catch (err) {
        console.error(
          "Error fetching questions:",
          err.response?.data || err.message
        );
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  // 👇 Only take the visible part
  const visibleQuestions = filteredQuestions.slice(0, visibleCount);

  return (
    <div className="home-container">
      <h2 className="wellcom_msg">
        Welcome: <span className="username">{user?.username}</span>
      </h2>

      <div className="ask-section">
        <button className="ask-btn" onClick={() => navigate("/QuestionPage")}>
          Ask Question
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search question"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="questions-list">
        {visibleQuestions.map((q) => (
          <div
            key={q.questionid}
            className="question-item"
            onClick={() => navigate(`/answer/${q.questionid}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="question-left">
              <div className="avatar">👤</div>
              <div>
                <div className="question-text">{q.title}</div>
                <div className="author">{q.username}</div>
              </div>
            </div>
            <div className="arrow">➡</div>
          </div>
        ))}
      </div>

      {/* 👇 Load more button */}
      {visibleCount < filteredQuestions.length && (
        <div className="see-more-container">
          <button
            className="see-more-btn"
            onClick={() => setVisibleCount((prev) => prev + 5)} // show 5 more each time
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
