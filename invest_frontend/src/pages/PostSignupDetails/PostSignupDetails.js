import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postSignup } from "../../apis/authApi";
import "./PostSignupDetails.css";
import PhoneInput from "react-phone-input-2";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const PostSignupPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, email: emailFromState, mobile_no: mobileFromState } = location.state || {};

    const emailFrom = emailFromState || "";
    const mobileFrom = mobileFromState || "";

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState(emailFromState || "");
    const [mobile, setMobile] = useState(mobileFromState || "");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    useEffect(() => {
        if (token) {
            fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
                .then((res) => res.json())
                .then((data) => {
                    setEmail(data.email || "");
                    setFirstName(data.given_name || "");
                    setLastName(data.family_name || "");
                })
                .catch((err) => console.error("Google token verification failed", err));
        }
    }, [token]);

    useEffect(() => {
        if (!token && !emailFromState && !mobileFromState) {
            navigate("/signup"); // or wherever your signup page is
        }
    }, []);

    const handleContinue = async () => {
        setLoading(true);
        
        try {
            const formattedMobile = mobile;
            const res = await postSignup({
                token,
                email: email || "",
                mobile_no: formattedMobile,
                first_name: firstName,
                last_name: lastName,
            });

            navigate("/verify-otp", {
                state: {
                    customer_id: res.customer_id,
                    email,
                    mobile_no: mobile,
                    first_name: firstName,
                    last_name: lastName,
                    source: "post-signup"
                },
            });
        } catch (error) {
            // alert(err?err.message || "Registration failed.");
            setPopup({ isOpen: true, message: error?.message || error?.error || "Registration failed.", type: "error" });

        } finally {
            setLoading(false);
        }
    };

    const isContinueDisabled =
        loading ||
        (emailFromState && !mobile) ||         // If only email given, mobile is mandatory
        (mobileFromState && !email) ||         // If only mobile given, email is mandatory
        (!emailFromState && !mobileFromState && (!email || !mobile)); // If neither, both are mandatory

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-heading">Let's get to know you better</h2>
                <div className="login-name-section">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="login-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="login-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                {/* EMAIL SIGNUP: no token, but emailFromState exists */}
                {!token && emailFromState && (
                    <>
                        {/* <input
                            type="email"
                            placeholder="Email"
                            className="login-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        /> */}
                        <PhoneInput
                            country={"in"}
                            value={mobile}
                            onChange={(value) => setMobile(value)}
                            inputClass="login-input"
                            containerClass="phone-input-container"
                            inputProps={{ name: "mobile", required: true }}
                            placeholder="Enter Mobile Number"
                        />
                    </>
                )}

                {/* MOBILE SIGNUP: no token, but mobileFromState exists */}
                {!token && mobileFromState && (
                    <input
                        type="email"
                        placeholder="Email"
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}

                {/* GOOGLE SIGNUP: token present */}
                {token && (
                    <PhoneInput
                        country={"in"}
                        value={mobile}
                        onChange={(value) => setMobile(value)}
                        inputClass="login-input"
                        containerClass="phone-input-container"
                        inputProps={{ name: "mobile", required: true }}
                        placeholder="Enter Mobile Number"
                    />
                )}


                <button
                    className="continue-btn"
                    disabled={isContinueDisabled}
                    onClick={handleContinue}
                >
                    {loading ? "Processing..." : "Continue"}
                </button>

                <div className="separator"> </div>
                <div className="signup-link">
                    By continuing, you agree to our <a href="#">T&Cs</a> and <a href="#">Privacy Policy</a>
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

export default PostSignupPage;
