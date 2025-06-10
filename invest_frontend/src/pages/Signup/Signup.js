import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import { RiArrowLeftSLine } from "react-icons/ri";
import { registerCustomer } from "../../apis/authApi";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const SignupPage = () => {
    const [emailOrMobile, setEmailOrMobile] = useState("");
    const [isEmail, setIsEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: "698181623361-025dk4qeov6gk2er133mlcrnjka59fq6.apps.googleusercontent.com",
                    callback: handleGoogleResponse,
                });

                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    { theme: "outline", size: "large" }
                );

                clearInterval(interval); // stop checking once initialized
            }
        }, 100); // check every 100ms

        return () => clearInterval(interval); // cleanup
    }, []);




    // handleGoogleResponse
    const handleGoogleResponse = async (response) => {
        setLoading(true);
        try {
            const token = response.credential;
            const res = await registerCustomer({ token });

            if (res.message === "Account already verified. Please proceed to next step.") {
                setPopup({ isOpen: true, message: res.message, type: "info" });
                setTimeout(() => {
                    navigate("/post-signup");

                }, 5000); // 5 seconds
                return;
            }

            setPopup({ isOpen: true, message: res.message, type: "success" });
            navigate("/verify-otp", {
                state: {
                    email: res.email || "",
                    mobile_no: res.mobile_no || "",
                },
            });
        } catch (error) {
            setPopup({ isOpen: true, message: error?.message || "Google Sign-in failed.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginClick = () => {
        if (window.google) {
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    setPopup({
                        isOpen: true,
                        message: "Google Sign-in was not completed. Please try again.",
                        type: "info",
                    });
                }
            });
        } else {
            setPopup({
                isOpen: true,
                message: "Google Sign-in not loaded yet. Please refresh.",
                type: "error",
            });
        }
    };

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
                : { mobile_no: `+${emailOrMobile}` };

            const response = await registerCustomer(payload);
                localStorage.setItem("customer_id",response.customer_id);

            if (response.message === "Account already verified. Please proceed to next step.") {
                setPopup({ isOpen: true, message: response.message, type: "info" });
                setTimeout(() => {
                    navigate("/post-signup", {
                       state: {
                        email: response.email || payload.email || "",
                        mobile_no: response.mobile_no || payload.mobile_no || "",
                    },
                    });

                }, 5000); // 5 seconds
                return;
            }

            setPopup({ isOpen: true, message: response.message, type: "success" });
            navigate("/verify-otp", {
                state: {
                    email: payload.email || "",
                    mobile_no: payload.mobile_no || "",
                },
            });
        } catch (error) {
            setPopup({ isOpen: true, message: error?.error || "Signup failed. Try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-heading">Create a Pavaman Account</h2>
                <div id="google-signin-div" style={{ display: "none" }}></div>
                <div id="googleBtn">

                    <button

                        className="google-login-btn"
                        onClick={handleGoogleLoginClick}
                        disabled={loading}
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                            alt="Google icon"
                        />
                        Continue with Google
                    </button>
                </div>
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
                        placeholder="Enter Email or Mobile Number"
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
                    Already have an account? <a href="/login">Login Now</a>
                </div>

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

export default SignupPage;
