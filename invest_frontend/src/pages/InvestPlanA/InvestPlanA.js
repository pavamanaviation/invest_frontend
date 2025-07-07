import React from "react";
import { useNavigate } from "react-router-dom"
import "./InvestPlanA.css";
import BankNomineeFormPage from "../BankNomineeFormPage/BankNomineeFormPage";

const InvestPlanA = () => {
       const navigate = useNavigate();
      const handleInvestClick = () => {
        navigate("/bank-nominee");
    };

    return (
        <div className="invest-plan-container">
            <h1 className="invest-title">PAVAMAN DRONE LEASE SCHEME – Plan A</h1>
            <p className="invest-subtitle">High, Consistent Monthly Returns on Your Drone Investment</p>
            <div className="invest-section">

                <div className="invest-about">
                    <h2>About Plan A</h2>
                    <ul>
                        <li>Purchase the <strong>TEJA-S</strong>, a DGCA-approved agricultural drone</li>
                        <li><strong>Investment:</strong> ₹12 Lakhs (Inclusive of GST)</li>
                        <li>Pavaman Agri Ventures leases your drone and operates it across agriculture projects</li>
                        <li><strong>Returns:</strong> ₹25,000/month for 66 months directly credited to your account</li>
                        <li><strong>Total Earnings:</strong> ₹18,06,000 over 5.5 years (includes ₹1,56,000 residual value)</li>
                        <li><strong>No management or operations from your side — we handle everything</strong></li>
                    </ul>
                </div>

                <div className="invest-plan-card">
                    <h3>Plan A Summary</h3>
                    <p><strong> Investment:</strong> ₹12,00,000 (Incl. GST)</p>
                    <p><strong> Duration:</strong> 66 Months</p>
                    <p><strong> Monthly Returns:</strong> ₹25,000/month</p>
                    <p><strong> Total Earnings:</strong> ₹18,06,000</p>
                    <p><strong> Residual Value:</strong> ₹1,56,000 included</p>
                </div>
            </div>

            <div className="included-section">
                <h2>What’s Included</h2>
                <ul>
                    <li><strong>TEJA-S Drone</strong> with Accessories</li>
                    <li>66-Month AMC — FREE spare parts & servicing</li>
                    <li>Drone operated by <strong>Pavaman Agri Ventures</strong> on your behalf</li>
                </ul>
                <p className="powered-by">Offered by <strong>Pavaman Aviation Pvt. Ltd.</strong> & <strong>Pavaman Agri Ventures Pvt. Ltd.</strong></p>
            </div>

            <div className="invest-action">
                <button className="primary-button"  onClick={handleInvestClick}>Invest Now</button>
            </div>
        </div>
    );
};

export default InvestPlanA;
