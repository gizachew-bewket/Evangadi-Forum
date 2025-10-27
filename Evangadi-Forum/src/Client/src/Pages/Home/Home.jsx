import React, { useContext, useState, useEffect } from "react";
import { Appstate } from "../Appstate";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";

/**

 * 1. User Authentication & Authorization
 * 2. Questions Display with Real-time Data
 * 3. Search Functionality
 * 4. Pagination (Load More)
 * 5. CRUD Operations (Create, Read, Update, Delete)
 */  

const Home = () => {

  
  const navigate = useNavigate();
  const { user, setUser } = useContext(Appstate); // Global user context
  
  const [questions, setQuestions] = useState([]);      // All questions from database
  const [search, setSearch] = useState("");            // Search query string
  const [visibleCount, setVisibleCount] = useState(5); // Pagination control

  // AUTHENTICATION CHECK (Effect Hook #1)
  // ============================================
//   2. AUTHENTICATION FLOW:
//  *    - Checks localStorage for token on mount
//  *    - Validates token with backend
//  *    - Redirects to login if invalid

  
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Step 1: Get stored credentials from localStorage
        const token = localStorage.getItem("token");
        const savedUsername = localStorage.getItem("username");
        const savedUserid = localStorage.getItem("userid");

        // Step 2: Redirect to login if no authentication found
        if (!token || !savedUsername) {
          navigate("/login");
          return;
        }
        
        // Step 3: Restore user context if missing
        if (!user?.username) {
          setUser({ username: savedUsername, userid: savedUserid });
        }
        
        // Step 4: Verify token with backend
        await axiosInstance.get("/user/checkUser", {
          headers: { Authorization: "Bearer " + token },
        });
        
      } catch (err) {
        // If token is invalid/expired, redirect to login
        console.error("Token check failed:", err.response?.data || err.message);
        navigate("/login");
      }
    };

    verifyUser();
  }, [user, setUser, navigate]);

  // ============================================
  // FETCH QUESTIONS (Effect Hook #2)
  // ============================================

//   3. DATA FETCHING:
//  *    - Uses axios to fetch questions from API
//  *    - Displays in reverse chronological order (newest first)
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // GET request to fetch all questions
        const res = await axiosInstance.get("/question", {
          headers: { Authorization: "Bearer " + token },
        });
        
        // Reverse to show newest first
        setQuestions(res.data.data.reverse());
        
      } catch (err) {
        console.error("Error fetching questions:", err.response?.data || err.message);
      }
    };
    
    fetchQuestions();
  }, []); // Runs once on component mount

  // ============================================
  // SEARCH & PAGINATION LOGIC
  // ============================================
  
  // Filter questions based on search input
  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  // Limit displayed questions for pagination
  const visibleQuestions = filteredQuestions.slice(0, visibleCount);

  // ============================================
  // DELETE OPERATION
  // ============================================
//   USER PERMISSIONS:
//  *    - Only question owners see Edit/Delete buttons
//  *    - Checked via: q.userid === user?.userid
//  * 
  
  const deleteQuestion = async (e, questionid) => {
    e.stopPropagation(); // Prevent navigation when clicking delete
    
    // Confirmation dialog
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // DELETE request to backend
      await axiosInstance.delete(`/question/${questionid}`, {
        headers: { Authorization: "Bearer " + token },
      });
      
      // Update local state to remove deleted question
      setQuestions((prev) => prev.filter((q) => q.questionid !== questionid));
      
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error deleting question");
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  
  return (
    <div className="home-container">
      
      {/* Welcome Header */}
      <h2 className="wellcom_msg">
        Welcome: <span className="username">{user?.username}</span>
      </h2>

      {/* Ask Question Button - Navigates to Question Creation Page */}
      <div className="ask-section">
        <button className="ask-btn" onClick={() => navigate("/QuestionPage")}>
          Ask Question
        </button>
      </div>

      {/* Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search question"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Questions List */}
      <div className="questions-list">
        {visibleQuestions.map((q) => (
          <div
            key={q.questionid}
            className="question-item"
            onClick={() => navigate(`/answer/${q.questionid}`)} // Navigate to answers
            style={{ cursor: "pointer" }}
          >
            {/* Left Section: Avatar + Question Info */}
            <div className="question-left">
              <div className="avatar">👤</div>
              <div>
                <div className="question-text">{q.title}</div>
                <div className="author">
                  {q.username} &nbsp;•&nbsp;{" "}
                  <span className="date">
                    {new Date(q.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit/Delete Buttons - Only visible to question owner */}
            {q.userid === user?.userid && (
              <div className="question-actions">
                <button
                  className="edit-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation
                    navigate(`/QuestionPage/${q.questionid}/edit`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={(e) => deleteQuestion(e, q.questionid)}
                >
                  Delete
                </button>
              </div>
            )}

            {/* Right Arrow Icon */}
            <div className="arrow">➡</div>
          </div>
        ))}
      </div>

      {/* Load More Button - Shows if there are more questions */}
      {visibleCount < filteredQuestions.length && (
        <div className="see-more-container">
          <button
            className="see-more-btn"
            onClick={() => setVisibleCount((prev) => prev + 5)}
          >
            See More
          </button>
        </div>
      )}
      
    </div>
  );
};

export default Home;

/**
 * ============================================
 * DEFENSE TALKING POINTS
 * ============================================
 * 
 * 1. COMPONENT PURPOSE:
 *    - Main dashboard/landing page after login
 *    - Central hub for viewing and managing questions
 * 
 * 2. AUTHENTICATION FLOW:
 *    - Checks localStorage for token on mount
 *    - Validates token with backend
 *    - Redirects to login if invalid
 * 
 * 3. DATA FETCHING:
 *    - Uses axios to fetch questions from API
 *    - Displays in reverse chronological order (newest first)
 * 
 * 4. USER PERMISSIONS:
 *    - Only question owners see Edit/Delete buttons
 *    - Checked via: q.userid === user?.userid
 * 
 * 5. SEARCH FEATURE:
 *    - Real-time filtering by question title
 *    - Case-insensitive search
 * 
 * 6. PAGINATION:
 *    - Shows 5 questions initially
 *    - "See More" loads 5 more at a time
 *    - Improves performance with large datasets
 * 
 * 7. ROUTING:
 *    - Ask Question → /QuestionPage
 *    - View Answers → /answer/:questionid
 *    - Edit Question → /QuestionPage/:questionid/edit
 * 
 * 8. ERROR HANDLING:
 *    - Try-catch blocks for all API calls
 *    - User-friendly alerts for errors
 *    - Console logging for debugging
 */
