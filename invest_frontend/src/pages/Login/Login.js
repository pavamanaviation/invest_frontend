import React, { useState } from "react";
import "./Login.css";
import { RiArrowLeftSLine } from "react-icons/ri";
import { loginCustomer } from "../../apis/authApi";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";


const LoginPage = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [isEmail, setIsEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });


    const handleInputChange = (value) => {
        if (!value) {
            setIsEmail(null);
            setEmailOrMobile("");
            return;
        }
        const firstChar = value[0];
        if (/^[a-zA-Z]$/.test(firstChar)) {
            setIsEmail(true);
        } else if (/^\d$/.test(firstChar)) {
            setIsEmail(false);
        } else {
            setIsEmail(true);
        }
        setEmailOrMobile(value);
    };


  const handleContinue = async () => {
    setLoading(true);
    try {
      const payload = isEmail
        ? { email: emailOrMobile }
        : { mobile_no: `+${emailOrMobile}` }; // Include "+" for full number

      const response = await loginCustomer(payload);

      if (response.message.includes("OTP")) {
        navigate("/verify-otp", {
          state: {
            email: payload.email || "",
            mobile_no: payload.mobile_no || "",
            customer_id: response.customer_id,
            source: "login"
          },
        });
      } else {
        // alert("Login Successful!");
        setPopup({ isOpen: true, message: "Login Successful!", type: "success" });
        sessionStorage.setItem("customer_id",response.customer_id);
        sessionStorage.setItem("session_id",response.session_id);
        setTimeout(() => {
          navigate("/customer-dashboard");


        }, 5000);
      }
    } catch (error) {
      // alert(error?.error || error.message || "Login failed. Try again.");
      setPopup({ isOpen: true, message: error?.error || error.message || "Login failed. Try again.", type: "error" });

    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await loginCustomer({ token: credentialResponse.credential });

      if (response.message.includes("Login successful via Google")) {
        // alert("Google Login Successful");
        setPopup({ isOpen: true, message: "Login Successful!", type: "success" });
        sessionStorage.setItem("customer_id",response.customer_id);
         sessionStorage.setItem("session_id",response.session_id);
        setTimeout(() => {
          navigate("/customer-dashboard");
        }, 5000);
      }
    } catch (error) {
      // alert(error?.error || error.message || "Google Login failed");
      setPopup({ isOpen: true, message: error?.error || error.message || "Google Login failed", type: "error" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-heading">Login to Pavaman</h2>

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => alert("Google Sign-In Failed")}
        />

        <div className="separator"><span>OR</span></div>

        {isEmail === false ? (
          <PhoneInput
            country={"in"}
            value={emailOrMobile}
            onChange={(value) => {
              if (!value) {
                setIsEmail(null);
                setEmailOrMobile("");
              } else {
                setEmailOrMobile(value);
              }
            }}
            inputClass="login-input"
            containerClass="phone-input-container"
            inputProps={{ name: "mobile", required: true }}
            placeholder="Enter Mobile Number"
          />
        ) : (
          <input
            type="text"
            placeholder="Enter Email or Mobile Number"
            value={emailOrMobile}
            onChange={(e) => handleInputChange(e.target.value)}
            className="login-input"
          />
        )}

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

                  <PopupMessage
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />
    </div>
  );
};

export default LoginPage;
