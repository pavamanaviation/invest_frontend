
import React, { useState } from "react";
import "./AdminLogin.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import API_BASE_URL from "../../config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setOtpSent(true);
        sessionStorage.setItem("admin_email", data.email);
        setPopup({
          show: true,
          message: data.message || "OTP sent successfully.",
          type: "success",
        });
      } else {
        setPopup({
          show: true,
          message: data.error || "Login failed.",
          type: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      setPopup({
        show: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
      console.error("Login Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin-verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setPopup({
          show: true,
          message: "OTP verified successfully.",
          type: "success",
        });

        console.log("Admin ID:", data.admin_id);
      } else {
        setPopup({
          show: true,
          message: data.error || "OTP verification failed.",
          type: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      setPopup({
        show: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
      console.error("OTP Verification Error:", error);
    }
  };

  return (
    <div className="admin-login-container">
      {popup.show && (
        <PopupMessage
          isOpen={popup.show}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      <div className="admin-login-box">
        <h2 className="admin-login-heading">Login to Admin Panel</h2>

        {!otpSent ? (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
              autoComplete="off"
            />

            {/* Password Input with Toggle */}
            <div className="admin-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login-input admin-password-input"
                autoComplete="new-password"
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>

            <button
              className="admin-continue-btn"
              onClick={handleLogin}
              disabled={!email || !password || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="admin-login-input"
            />
            <button
              className="admin-continue-btn"
              onClick={handleVerifyOtp}
              disabled={!otp || loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
