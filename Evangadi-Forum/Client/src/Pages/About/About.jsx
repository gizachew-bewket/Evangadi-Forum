import React from "react";
import "./About.css";

const About = () => {
  return (
    <div>
      <div className="container">
        <h1 className="section-title">How It Works</h1>

        <div className="description-card">
          <h3>Evangadi Networks</h3>
          <p>
            No matter what stage of life you are in, whether you're just
            starting elementary school or being promoted to CEO of a Fortune 500
            company, you have much to offer to those who are trying to follow in
            your footsteps.
          </p>
          <p>
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
        </div>

        <div className="how-it-works-steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Create Your Account</h4>
            <p>
              Sign up with your email and create a profile to join our
              community.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Ask Questions</h4>
            <p>
              Post questions and get answers from experienced community members.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Share Knowledge</h4>
            <p>Answer questions and help others grow with your expertise.</p>
          </div>

          <div className="step-card">
            <div className="step-number">4</div>
            <h4>Build Connections</h4>
            <p>Connect with mentors and mentees to grow together.</p>
          </div>
        </div>

        <div className="back-to-home-btn-container">
          <a href="/home" className="back-to-home-btn">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
