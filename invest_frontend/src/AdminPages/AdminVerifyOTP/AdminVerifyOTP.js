import React, { useState } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./AdminVerifyOTP.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const AdminVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "" });

  const navigate = useNavigate();
  const email = sessionStorage.getItem("admin_email");

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/admin-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setPopup({
          isOpen: true,
          message: "OTP verified successfully.",
          type: "success",
        });
        setTimeout(() => {
          navigate("/admin-dashboard"); // Update path as per your route
        }, 1500);
      } else {
        setPopup({
          isOpen: true,
          message: data.error || "OTP verification failed.",
          type: "error",
        });
      }
    } catch (error) {
      setPopup({
        isOpen: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
      console.error("Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-heading">Enter OTP to Verify</h2>

        <p className="admin-otp-text">
          Enter the 6-digit OTP sent to <strong>{email}</strong>{" "}
          <span className="admin-otp-text-btn" onClick={() => navigate("/admin-login")}>
            Change
          </span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="admin-login-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="admin-continue-btn"
          disabled={!otp || loading}
          onClick={handleOtpVerification}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="admin-back-home">
          <span><RiArrowLeftSLine /></span>
          <span><a href="/admin-login"> Back to Login</a></span>
        </div>
      </div>

      <PopupMessage
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
    </div>
  );
};

export default AdminVerifyOtp;
