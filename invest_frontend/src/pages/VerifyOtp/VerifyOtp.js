import React, { useState, useEffect } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyCustomerOtp, registerCustomer, verifyLoginOtp,loginCustomer } from "../../apis/authApi"; // Resend calls same register API
import "./VerifyOtp.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import axios from "axios";
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
      let response;

      if (source === "signup" || source === "post-signup") {
        response = await verifyCustomerOtp({
          otp,
          email,
          mobile_no,
          customer_id,
        });
      } else if (source === "login") {
        response = await verifyLoginOtp({ otp, email, mobile_no });
      }

      setPopup({
        isOpen: true,
        message: "OTP verified successfully.",
        type: "success",
      });

      // 🔁 Role-based redirection using ID fields
      if (response.admin_id) {
        sessionStorage.clear()
        sessionStorage.setItem("admin_id", response.admin_id);
        sessionStorage.setItem("session_id", response.session_id);
        sessionStorage.setItem('role_type',"admin"); 
        sessionStorage.setItem("is_logged_in", "true");

        navigate("/admin-dashboard");
      } else if (response.role_id) {
        sessionStorage.clear()

        sessionStorage.setItem("role_id", response.role_id);
        sessionStorage.setItem("session_id", response.session_id);
        sessionStorage.setItem("is_logged_in", "true");

        navigate("/role-dashboard");
      } else if (response.customer_id) {
        sessionStorage.clear()

        sessionStorage.setItem("customer_id", response.customer_id);
        sessionStorage.setItem("session_id", response.session_id);
        sessionStorage.setItem("customer_email", response.email);
        if (source === "signup") {
          navigate("/post-signup", {
            state: {
              email: response.email || "",
              mobile_no: response.mobile_no?.startsWith("+")
                ? response.mobile_no
                : `+${response.mobile_no}`,
            },
          });
        } else {
        sessionStorage.setItem("is_logged_in", "true");

          navigate("/customer-dashboard");
        }
      } else {
        setPopup({
          isOpen: true,
          message: "Unable to determine login role.",
          type: "error",
        });
      }
    } catch (error) {
      setPopup({
        isOpen: true,
        message: error?.error || "OTP verification failed.",
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
    let res;

    if (source === "login") {
      res = await loginCustomer(payload);
    } else {
      res = await registerCustomer(payload);
    }

    setPopup({
      isOpen: true,
      message: res.message || "OTP resent successfully.",
      type: "success",
    });

    setTimer(120); // Reset timer
  } catch (error) {
    console.error(error);
    setPopup({
      isOpen: true,
      message: error?.error || "Failed to resend OTP.",
      type: "error",
    });
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
