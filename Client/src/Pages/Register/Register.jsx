import axiosInstance from "../../axiosconfig";
import "./Register.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  // state for inputs
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state for UI feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const validateForm = () => {
    if (!email || !firstName || !lastName || !username || !password) {
      setError("All fields are required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/register", {
        username: username,
        firstname: firstName,
        lastname: lastName,
        email: email,
        user_password: password,
      });

      setSuccess(res.data.message || "Registered successfully! Redirecting...");
      setError("");

      // redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="form-title">Join the network</h2>
      <p className="signin-prompt">
        Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
      </p>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />

        <div className="name-fields">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-input"
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
          <span 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button 
          type="submit" 
          className="register-btn"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Agree and Join"}
        </button>

        <p className="policy-text">
          I agree to the <a href="/privacy" className="policy-link">privacy policy</a> and{" "}
          <a href="/terms" className="policy-link">terms of service</a>.
        </p>
      </form>

      <p className="signin-prompt-bottom">
        Already have an account? <Link to="/login" className="signin-link">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
