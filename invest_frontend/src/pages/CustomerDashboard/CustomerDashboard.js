import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./CustomerDashboard.css";

import Tejas from "../../assets/TEJA-S-1.png"

const CustomerDashboard = () => {
      const location = useLocation();
  const navigate = useNavigate();
const [kycCompleted, setKycCompleted] = useState(false);
  const handleKyc = () => {
   navigate("/user-kyc")
    setKycCompleted(true);
  };
    return (
        <div className="customer-dashboard">
            <div className="cd-image-plans-section container">
                <div className="cd-image-section">
                    <div className="cd-heading">TEJA-S Drone</div>
                    <div className="cd-image-text">
                        <img src={Tejas} />
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
                                <p>₹12 Lakhs (Inclusive of GST)</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Monthly Returns</span>
                                <p>₹25,000/month for 66 months</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Total Earnings</span>
                                <p>₹18,06,000<br />(Includes ₹1,56,000 residual value)</p>
                            </div>
                        </div>

                        {/* Plan B */}
                        <div className="plan-card">
                            <h3 className="plan-title plan-b">Plan B</h3>
                            <div className="plan-section">
                                <span className="label">Investment Amount</span>
                                <p>₹12 Lakhs (Inclusive of GST)</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Returns</span>
                                <p>₹22.44 Lakhs<br />(Lump sum at the end of 66 months)</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Total Earnings</span>
                                <p>₹24,00,000<br />(Includes ₹1,56,000 residual value)</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );

}

export default CustomerDashboard;