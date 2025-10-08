import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosconfig";
import "./Login.css";
import { Appstate } from "../Appstate"; // ✅ import context

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(Appstate); // ✅ access setUser from context

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true);
   setError("");
   setSuccess("");

   if (!email || !password) {
     setError("Please enter both email and password");
     setLoading(false);
     return;
   }
   if (!/\S+@\S+\.\S+/.test(email)) {
     setError("Invalid email format");
     setLoading(false);
     return;
   }

   try {
     const response = await axiosInstance.post("/user/login", {
       email,
       user_password: password,
     });

     const { token, message, username, userid } = response.data;

     setSuccess(message || "Login successful!");

     // ✅ Save token properly
     localStorage.setItem("token", token);
     console.log("Saved token:", token);

     // ✅ Save user in context
     setUser({ username, userid });

     // (Optional) save username in localStorage
     localStorage.setItem("username", JSON.stringify(username));

     // Redirect to home
     setTimeout(() => navigate("/home"), 1000);
   } catch (err) {
     setError(err.response?.data?.message || "Invalid email or password");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="login-container">
      <h2>Login to your account</h2>
      <p>
        Don’t have an account?{" "}
        <Link to="/register" className="link-highlight">
          Create a new account
        </Link>
      </p>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
