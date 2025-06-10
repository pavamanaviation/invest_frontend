import React, { useState } from "react";
import "./KYC.css";

const KYCPage = () => {
    const [step, setStep] = useState("identity"); // identity, bank, personal, others
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [isAadharVerified, setIsAadharVerified] = useState(false);

    const handlePanVerify = () => {
        // Add your PAN validation logic here
        setIsPanVerified(true);
    };

    const handleAadharVerify = () => {
        // Add your Aadhar validation logic here
        setIsAadharVerified(true);
        setStep("bank");
    };

    return (
        <div className="kyc-container">
            <div className="kyc-header">
                <h2>Complete KYC</h2>
            </div>

            <div className="kyc-stepper">
                <div className={`kyc-step ${step === "identity" ? "active" : isAadharVerified ? "completed" : ""}`}>Identity</div>
                <div className={`kyc-step ${step === "bank" ? "active" : step !== "identity" && isAadharVerified ? "" : "disabled"}`}>Bank</div>
                <div className={`kyc-step ${step === "personal" ? "active" : "disabled"}`}>Personal Info</div>
                <div className={`kyc-step ${step === "others" ? "active" : "disabled"}`}>Others</div>
            </div>

            {step === "identity" && (
                <div className="kyc-form-section">
                    {!isPanVerified ? (
                        <>
                            <label className="kyc-label">Verify PAN Number</label>
                            <input className="kyc-input" type="text" placeholder="Your PAN Number" />
                            <button className="kyc-submit-btn" onClick={handlePanVerify}>
                                Verify PAN &rarr;
                            </button>
                        </>
                    ) : !isAadharVerified ? (
                        <>
                            <label className="kyc-label">Verify Aadhar Number</label>
                            <input className="kyc-input" type="text" placeholder="Your Aadhar Number" />
                            <button className="kyc-submit-btn" onClick={handleAadharVerify}>
                                Verify Aadhar &rarr;
                            </button>
                        </>
                    ) : null}

                    <p className="kyc-note">
                        By proceeding, you are giving consent to fetch your address details and
                        share with KYC registration agencies.
                    </p>
                </div>
            )}

            {step === "bank" && (
                <div className="kyc-form-section">
                    <label className="kyc-label">Bank Account Number</label>
                    <input className="kyc-input" type="text" placeholder="Enter Account Number" />
                    <label className="kyc-label">IFSC Code</label>
                    <input className="kyc-input" type="text" placeholder="Enter IFSC Code" />
                    <button className="kyc-submit-btn" onClick={() => setStep("personal")}>
                        Save & Proceed to Personal Info &rarr;
                    </button>
                </div>
            )}

            {step === "personal" && (
                <div className="kyc-form-section">
                    <label className="kyc-label">Full Name</label>
                    <input className="kyc-input" type="text" placeholder="Your Full Name" />
                    <label className="kyc-label">Date of Birth</label>
                    <input className="kyc-input" type="date" />
                    <button className="kyc-submit-btn" onClick={() => setStep("others")}>
                        Save & Proceed to Others &rarr;
                    </button>
                </div>
            )}

            {step === "others" && (
                <div className="kyc-form-section">
                    <label className="kyc-label">Nominee Name</label>
                    <input className="kyc-input" type="text" placeholder="Nominee Name" />
                    <button className="kyc-submit-btn">
                        Submit KYC &rarr;
                    </button>
                </div>
            )}
        </div>
    );
};

export default KYCPage;
