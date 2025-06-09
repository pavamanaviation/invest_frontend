import React, { useState } from "react";
import "./Login.css";
import { RiArrowLeftSLine } from "react-icons/ri";
import { registerCustomer } from "../../apis/authApi";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    setLoading(true);
    try {
      const isEmail = emailOrMobile.includes("@");
      const payload = isEmail
        ? { email: emailOrMobile }
        : { mobile_no: emailOrMobile };

      const response = await registerCustomer(payload);

      alert(response.message);
      navigate("/verify-otp", {
        state: {
          email: payload.email || "",
          mobile_no: payload.mobile_no || "",
        },
      });
    } catch (error) {
      alert(error?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Login to Pavaman</h2>

        <button className="google-login-btn">
          <img
            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
            alt="Google icon"
          />
          Continue with Google
        </button>

        <div className="separator"><span>OR</span></div>

        <input
          type="text"
          placeholder="Enter Mobile or Email"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          className="login-input"
        />

        <button
          className="continue-btn"
          onClick={handleContinue}
          disabled={!emailOrMobile || loading}
        >
          {loading ? "Processing..." : "Continue"}
        </button>

        <div className="separator"> </div>
        <div className="signup-link">
          Don’t have an account? <a href="/signup">Sign up Now</a>
        </div>

        <div className="back-home">
          <span><RiArrowLeftSLine /></span>
          <span><a href="/home"> Back to home</a></span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
