import React, { useState, useEffect } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCustomerOtp, registerCustomer } from "../../apis/authApi"; // Resend calls same register API
import "./VerifyOtp.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes = 120 seconds
  const location = useLocation();
  const navigate = useNavigate();
  const customer_id = sessionStorage.getItem("customer_id");
  const { email = "", mobile_no = "", source = "" } = location.state || {};
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const response = await verifyCustomerOtp({ otp, email, mobile_no , customer_id});
      setTimeout(() => {
        setPopup({
          isOpen: true,
          message: "OTP verified successfully.",
          type: "success",
        });
      }, 5000);
      if (source === "signup") {
        navigate("/post-signup", {
          state: {
            email: response.email || "",
            mobile_no: `+${response.mobile_no}` || "",
            // mobile_no: response.mobile_no || "",

          },
        });
      } else if (source === "post-signup" || source === "login") {
        navigate("/customer-dashboard");
      } else {
        // fallback
        navigate("/");
      }
    } catch (error) {
      setPopup({
        isOpen: true,
        message: "OTP verification failed.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const payload = email ? { email } : { mobile_no };
      const res = await registerCustomer(payload);
      //   alert(res.message || "OTP resent.");
      setPopup({ isOpen: true, message: "OTP resent. " || res.message, type: "success" });

      setTimer(120); // Reset timer
    } catch (error) {
      //   alert(error?.error || "Failed to resend OTP.");
      console.error(error);
      setPopup({ isOpen: true, message: "Failed to resend OTP.", type: "error" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Enter OTP to Verify</h2>

        <div>
          <p className="otp-text">
            Enter the 6-digit OTP sent to {mobile_no || email}{" "}
            <span className="otp-text-btn" onClick={() => navigate("/signup")}>
              Change
            </span>
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter OTP"
          className="login-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />


        <div className="resend-otp-section">
          {timer > 0 ? (
            <p className="resend-timer">
              Resend OTP in <strong>{formatTime(timer)}</strong>
            </p>
          ) : (
            <button className="resend-btn" onClick={handleResendOtp} disabled={loading}>
              {loading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        <button
          className="continue-btn"
          disabled={!otp || loading}
          onClick={handleOtpVerification}
        >
          {loading ? "Verifying..." : "Proceed"}
        </button>


        <div className="back-home">
          <span><RiArrowLeftSLine /></span>
          <span><a href="/login"> Back to Login</a></span>
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

export default VerifyOtp;
