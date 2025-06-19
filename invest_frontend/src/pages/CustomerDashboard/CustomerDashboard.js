import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import Tejas from "../../assets/TEJA-S-1.png";
// import Tejasgif from "../../assets/drone-gif.gif"
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import axios from "axios";
import API_BASE_URL from "../../../src/config";

const CustomerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [kycCompleted, setKycCompleted] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });


    const customer_id = sessionStorage.getItem("customer_id");
    const [showTermsPopup, setShowTermsPopup] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);


    useEffect(() => {
  const fetchKYCStatus = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/customer-profile`, {
        customer_id: sessionStorage.getItem("customer_id"),
        action: "view"
      }, {
        withCredentials: true,
      });

      if (res.data.kyc_accept_status === 1) {
        setAgreedToTerms(true);
        // setKycCompleted(true); // or directly navigate to next step
        // navigate("/user-kyc");
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  fetchKYCStatus();
}, []);


    const handleKyc = () => {
        if (!customer_id) {
            setPopup({ isOpen: true, message: "Please log in to proceed to KYC", type: "info" });
            setTimeout(() => { navigate("/login"); }, 3000);
            return;
        }

        setShowTermsPopup(true); // show T&C popup
    };


    const handleAcceptAndProceed = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}/customer-profile`, {
      customer_id: sessionStorage.getItem("customer_id"),
      action: "save_kyc_accept_status",
      kyc_accept_status: 1,
    }, {
      withCredentials: true,
    });

    if (res.status === 200) {
      setShowTermsPopup(false);
      setKycCompleted(true);
      navigate("/user-kyc");
    }
  } catch (error) {
    console.error("Failed to save KYC accept status", error);
    alert("Something went wrong. Please try again.");
  }
};

    return (
        <div className="customer-dashboard">

            <PopupMessage
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />
            <div className="cd-image-plans-section container">
                <div className="cd-image-section">
                    <div className="cd-heading">TEJA-S Drone</div>
                    <div className="cd-image-text">
                        <img src={Tejas} className="cd-image" />
                        <a href="#">Know More Details...</a>
                    </div>
                    <div className="cd-buttons">
                        <button className="primary-button cd-button"
                            onClick={handleKyc}>
                            {kycCompleted ? "KYC Completed" : "Complete KYC"}
                        </button>
                        <button
                            className="primary-button cd-button"
                            disabled={!kycCompleted}>Proceed to Payment</button>
                    </div>

                </div>
                <div className="cd-plans-section">
                    <div className="cd-heading">Investment Plans</div>
                    <div className="investment-plans">

                        {/* Plan A */}
                        <div className="plan-card">
                            <h3 className="plan-title plan-a">Plan A</h3>
                            <div className="plan-section">
                                <span className="label">Investment Amount</span>
                                <p className="plan-text">₹12 Lakhs (Inclusive of GST)</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Monthly Returns</span>
                                <p className="plan-text">₹25,000/month </p>
                                <span>for 66 months</span>
                            </div>
                            <div className="plan-section">
                                <span className="label">Total Earnings</span>
                                <p className="plan-text">₹18,06,000<br />(Includes ₹1,56,000 residual value)</p>
                            </div>
                        </div>

                        {/* Plan B */}
                        <div className="plan-card">
                            <h3 className="plan-title plan-b">Plan B</h3>
                            <div className="plan-section">
                                <span className="label">Investment Amount</span>
                                <p className="plan-text">₹12 Lakhs (Inclusive of GST)</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Returns</span>
                                <p className="plan-text">₹22.44 Lakhs</p>
                                <span className="plan-text-small">(Lump sum at the end of 66 months)</span>
                            </div>
                            <div className="plan-section">
                                <span className="label">Total Earnings</span>
                                <p className="plan-text">₹24,00,000<br />(Includes ₹1,56,000 residual value)</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {showTermsPopup && (
                <div className="terms-popup-overlay">
                    <div className="terms-popup">
                        <h2 className="cd-heading">Terms & Conditions</h2>
                        <div className="terms-content">
                            <p>
                                Please read and accept our terms and conditions before proceeding with KYC.
                                <br /><br />
                                1. You agree to provide accurate and complete personal information.<br />
                                2. Your data will be used for verification and onboarding purposes.<br />
                                3. Investment returns are subject to terms outlined in the official plan document.<br />
                                4. Once KYC is completed, you are eligible for investment and plan selection.<br />
                                {/* You can expand this with real content as needed */}
                            </p>
                            <label className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />{" "}
                                I agree to the terms and conditions.
                            </label>
                        </div>

                        <div className="terms-buttons">
                            <button className="secondary-button" onClick={() => setShowTermsPopup(false)}>
                                Cancel
                            </button>
                            
                            <button
  className="primary-button"
  disabled={!agreedToTerms}
  onClick={handleAcceptAndProceed}
>
  Proceed
</button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );

}

export default CustomerDashboard;