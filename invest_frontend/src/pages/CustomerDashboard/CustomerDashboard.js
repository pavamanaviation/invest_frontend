import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import Tejas from "../../assets/TEJA-S-1.png";
// import Tejasgif from "../../assets/drone-gif.gif"
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const CustomerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [kycCompleted, setKycCompleted] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

  const [redirecting, setRedirecting] = useState(false); // New state

  const customer_id = sessionStorage.getItem("customer_id");

//   useEffect(() => {
//     if (!customer_id) {
//       setPopup({
//         isOpen: true,
//         message: "Please log in to view this page",
//         type: "info",
//       });
//       setRedirecting(true); // Immediately hide dashboard

//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);
//     }
//   }, [customer_id, navigate]);

//   // Show only popup while redirecting
//   if (redirecting) {
//     return (
//       <div className="customer-dashboard">
//         <PopupMessage
//           isOpen={popup.isOpen}
//           message={popup.message}
//           type={popup.type}
//           onClose={() => setPopup({ ...popup, isOpen: false })}
//         />
//       </div>
//     );
//   }
    const handleKyc = () => {
        navigate("/user-kyc")
        setKycCompleted(true);
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

        </div>
    );

}

export default CustomerDashboard;