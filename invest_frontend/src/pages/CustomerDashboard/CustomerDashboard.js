import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import Tejas from "../../assets/TEJA-S-1.png";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import axios from "axios";
import API_BASE_URL from "../../../src/config";

const CustomerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const customer_id = sessionStorage.getItem("customer_id");

    const [kycCompleted, setKycCompleted] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToPaymentTerms, setAgreedToPaymentTerms] = useState(false);
    const [showTermsPopup, setShowTermsPopup] = useState(false);
    const [showPaymentTermsPopup, setShowPaymentTermsPopup] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    useEffect(() => {
        const fetchKYCStatus = async () => {
            try {
                const res = await axios.post(
                    `${API_BASE_URL}/customer-profile`,
                    {
                        customer_id,
                        action: "view",
                    },
                    { withCredentials: true }
                );

                if (res.data.kyc_accept_status === 1) {
                    setAgreedToTerms(true);
                }

                if (res.data.payment_accept_status === 1) {
                    setAgreedToPaymentTerms(true);
                }
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };

        fetchKYCStatus();
    }, [customer_id]);

    const handleKyc = () => {
        if (!customer_id) {
            setPopup({
                isOpen: true,
                message: "Please log in to proceed to KYC",
                type: "info",
            });
            setTimeout(() => navigate("/login"), 3000);
            return;
        }
        setShowTermsPopup(true);
    };

    const handlePayment = () => {
        if (!customer_id) {
            setPopup({
                isOpen: true,
                message: "Please log in to proceed to payment",
                type: "info",
            });
            setTimeout(() => navigate("/login"), 3000);
            return;
        }
        setShowPaymentTermsPopup(true);
    };

    const handleAcceptAndProceed = async () => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/customer-profile`,
                {
                    customer_id,
                    action: "save_kyc_accept_status",
                    kyc_accept_status: 1,
                },
                { withCredentials: true }
            );

            if (res.status === 200) {
                setAgreedToTerms(true);
                setShowTermsPopup(false);
                setKycCompleted(true);
                navigate("/user-kyc");
            }
        } catch (error) {
            console.error("Failed to save KYC accept status", error);
            setPopup({
                isOpen: true,
                message: "Something went wrong. Please try again.",
                type: "error",
            });
        }
    };

    const handlePaymentAcceptAndProceed = async () => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/customer-profile`,
                {
                    customer_id,
                    action: "save_payment_accept_status",
                    payment_accept_status: 1,
                },
                { withCredentials: true }
            );

            if (res.status === 200) {
                setAgreedToPaymentTerms(true);
                setShowPaymentTermsPopup(false);
                navigate("/payment");
            }
        } catch (error) {
            console.error("Failed to save payment accept status", error);
            setPopup({
                isOpen: true,
                message: "Something went wrong. Please try again.",
                type: "error",
            });
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
                        <img src={Tejas} className="cd-image" alt="Teja Drone" />
                        <a href="#">Know More Details...</a>
                    </div>
                    <div className="cd-buttons">
                        <button className="primary-button cd-button" onClick={handleKyc}>
                            {kycCompleted ? "KYC Completed" : "Complete KYC"}
                        </button>
                        <button className="primary-button cd-button" onClick={handlePayment}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>

                <div className="cd-plans-section">
                    <div className="cd-heading">Investment Plans</div>
                    <div className="investment-plans">
                        <div className="plan-card">
                            <h3 className="plan-title plan-a">Plan A</h3>
                            <div className="plan-section">
                                <span className="label">Investment Amount</span>
                                <p className="plan-text">₹12 Lakhs (Inclusive of GST)</p>
                            </div>
                            <div className="plan-section">
                                <span className="label">Monthly Returns</span>
                                <p className="plan-text">₹25,000/month</p>
                                <span>for 66 months</span>
                            </div>
                            <div className="plan-section">
                                <span className="label">Total Earnings</span>
                                <p className="plan-text">
                                    ₹18,06,000<br />(Includes ₹1,56,000 residual value)
                                </p>
                            </div>
                        </div>

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
                                <p className="plan-text">
                                    ₹24,00,000<br />(Includes ₹1,56,000 residual value)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KYC Terms Popup */}
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
                                4. Once KYC is completed, you are eligible for investment and plan selection.
                            </p>
                            <label className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    disabled={agreedToTerms}
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

            {/* Payment Terms Popup */}
            {showPaymentTermsPopup && (
                <div className="terms-popup-overlay">
                    <div className="terms-popup">
                        <h2 className="cd-heading">Terms & Conditions</h2>
                        <div className="terms-content">
                            <p>
                                Please read and accept our terms and conditions before proceeding with payment.
                                <br /><br />

                                1. All applicants are requested to make payments directly in the company's name, Le, PAVAMAA AVIATION PRIVATE LIMITED. The bank details are given below<br />

                                    a) HDFC BANK<br />

                                A/c No: 50200089044235<br />

                                IFSC Code: HDFC0003788<br />

                                (OR)<br />

                                b) UNION BANK OF INDIA<br />

                                A/c No: 183911010000040<br />

                                IFSC Code: UBIN0818399<br />

                                The company cannot take responsibility for or be liable for payments made to any Individual, whether an employee or not.<br />

                                2. The applicant must submit copies of Aadhar Copy (optional), self-attested proof of address, self-at-tested proof of ID and PAN Card. If the application is in joint names, all applicants must sign the application form and submit these documents.<br />

                                3. A booking advance of Rs 1,00,000/-is to be paid at the time of booking for the purchase of a Drone. The balance of the sale consideration shall be paid by the Purchaser within 90 days thereafter. In case the balance is not paid within 90 days, the company will deduct Rs 10,000/-towards its opera tional expenses and refund the balance within 45 days.<br />

                                4. In case of cancellation of booking, the company will deduct Rs 10,000/-towards its operational expenses and refund the balance within 45 days after receiving a written request to cancel the application to purchase a TEJAS drone.<br />

                                5. Each system will consist of,<br />

                                    i) DGCA Approved TEJAS -1No<br />

                                    ii) Battery Sets - 4 Nos<br />

                                    iii) Diesel Generator 3KVA - 1No<br />

                                    iv) Water Tank - 1No<br />

                                6. The company will deliver the drone system in within 15 days from receipt of 100% of the amount<br />

                                7. The drone will have 66 months of AMC, during which the company will supply spares free of cost<br />
                            </p>
                            <label className="terms-checkbox">
                                <input
                                    type="checkbox"
                                    checked={agreedToPaymentTerms}
                                    onChange={(e) => setAgreedToPaymentTerms(e.target.checked)}
                                    disabled={agreedToPaymentTerms}
                                />{" "}
                                I agree to the terms and conditions.
                            </label>
                        </div>
                        <div className="terms-buttons">
                            <button className="secondary-button" onClick={() => setShowPaymentTermsPopup(false)}>
                                Cancel
                            </button>
                            <button
                                className="primary-button"
                                disabled={!agreedToPaymentTerms}
                                onClick={handlePaymentAcceptAndProceed}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
