import React, { useState } from "react";
import "./Login.css";

const LoginPage = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");

  return (
    <div className="login-container">
      <div className="login-box">
              <h2>Login to Pavaman</h2>

        <button className="google-login-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="Google icon"
          />
          Continue with Google
        </button>

        <div className="separator">
          <span>OR</span>
        </div>

        <input
          type="text"
          placeholder="Enter Mobile or Email"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
        />

        <button className="continue-btn" disabled={!emailOrMobile}>
          Continue
        </button>

        <div className="signup-link">
          Don’t have an account? <a href="#">Sign up Now</a>
        </div>

        <div className="back-home">
          <a href="#">← Back to home</a>
        </div>

        {/* <footer>© 2025 pavaman Broking Private Limited.</footer> */}
      </div>
    </div>
  );
};

export default LoginPage;
