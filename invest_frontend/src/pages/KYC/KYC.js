import React, { useState } from "react";
import "./KYC.css";
import { FaChevronRight } from "react-icons/fa";
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';

const KYCPage = () => {
    const [step, setStep] = useState("identity"); // identity, bank, personal, others
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [isAadharVerified, setIsAadharVerified] = useState(false);
    const [isNomineeVerified, setIsNomineeVerified] = useState(false);
    const [addressProof, setAddressProof] = useState("");

    const stepOrder = (s) => {
        const order = ["identity", "bank", "personal", "others"];
        return order.indexOf(s);
    };


    const handlePanVerify = () => {
        // Add your PAN validation logic here
        setIsPanVerified(true);
    };

    const handleAadharVerify = () => {
        // Add your Aadhar validation logic here
        setIsAadharVerified(true);
        setStep("bank");
    };

    const sigPadRef = useRef();

    const clearSignature = () => {
        sigPadRef.current.clear();
    };

    const saveSignature = () => {
        const dataUrl = sigPadRef.current.toDataURL(); // base64 image
        console.log("Signature Image:", dataUrl); // You can upload this to server
    };

    return (
        <div className="kyc-container container">
            <div className="kyc-header">
                <h2>Complete KYC</h2>
            </div>

            <div className="kyc-content">
                <div className="kyc-stepper">
                    {["identity", "bank", "personal", "others"].map((s, i) => (
                        <div
                            key={s}
                            className={`kyc-step-wrapper ${step === s ? "active" : stepOrder(step) > i ? "completed" : "disabled"
                                }`}
                        >
                            <div className="kyc-step-circle" />
                            <div className="kyc-step-label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                        </div>
                    ))}

                </div>


                {step === "identity" && (
                    <div className="kyc-form-section">
                        {!isPanVerified ? (
                            <>
                                <label className="kyc-label">Verify PAN Number</label>
                                <input className="kyc-input" type="text" placeholder="Your PAN Number" />
                                <button className="primary-button kyc-submit-btn" onClick={handlePanVerify}>
                                    Verify and Proceed <FaChevronRight />
                                </button>
                            </>
                        ) : !isAadharVerified ? (
                            <>
                                <label className="kyc-label">Verify Aadhar Number</label>
                                <input className="kyc-input" type="text" placeholder="Your Aadhar Number" />
                                <button className="primary-button kyc-submit-btn" onClick={handleAadharVerify}>
                                    Verify and Proceed <FaChevronRight />

                                </button>
                            </>
                        ) : null}
                    </div>
                )}

                {step === "bank" && (
                    <div className="kyc-form-section">
                        <label className="kyc-label">Bank Name</label>
                        <input className="kyc-input" type="text" placeholder="Enter Bank Name" />
                        <label className="kyc-label">Bank Account Number</label>
                        <input className="kyc-input" type="text" placeholder="Enter Account Number" />
                        <label className="kyc-label">IFSC Code</label>
                        <input className="kyc-input" type="text" placeholder="Enter IFSC Code" />
                        <button className="primary-button kyc-submit-btn" onClick={() => setStep("personal")}>
                            Verify and Proceed <FaChevronRight />

                        </button>
                    </div>
                )}

                {step === "personal" && (
                    <div className="kyc-form-section">
                        {/* Name Row */}
                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">First Name</label>
                                <input className="kyc-input" type="text" placeholder="First Name" />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Last Name</label>
                                <input className="kyc-input" type="text" placeholder="Last Name" />
                            </div>
                        </div>

                        {/* DOB + Gender Row */}
                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Date of Birth</label>
                                <input className="kyc-input" type="date" />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Gender</label>
                                <div className="kyc-radio-group">
                                    <label><input type="radio" name="gender" value="male" /> Male</label>
                                    <label><input type="radio" name="gender" value="female" /> Female</label>
                                </div>
                            </div>
                        </div>

                        {/* Profession Info */}
                        <div className="kyc-row three-columns">
                            <div className="kyc-column">
                                <label className="kyc-label">Profession</label>
                                <input className="kyc-input" type="text" placeholder="Profession" />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Company / Firm Name</label>
                                <input className="kyc-input" type="text" placeholder="Company / Firm Name" />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Designation</label>
                                <input className="kyc-input" type="text" placeholder="Your Designation" />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="kyc-row">
                            <div className="kyc-column-full">
                                <label className="kyc-label">Address</label>
                                <textarea className="kyc-input" placeholder="Full Address"></textarea>
                            </div>
                        </div>

                        {/* Pincode, Mobile, Email */}
                        <div className="kyc-row three-columns">
                            <div className="kyc-column">
                                <label className="kyc-label">Pincode</label>
                                <input className="kyc-input" type="text" placeholder="Pincode" />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Mobile No</label>
                                <input className="kyc-input" type="text" placeholder="Mobile Number" />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Email</label>
                                <input className="kyc-input" type="email" placeholder="Email Address" />
                            </div>
                        </div>

                        {/* Next Step Button */}
                        <button className="primary-button kyc-submit-btn" onClick={() => setStep("others")}>
                            Verify and Proceed <FaChevronRight />
                        </button>

                    </div>
                )}

                {step === "others" && (
                    <div className="kyc-form-section">
                        {!isNomineeVerified ? (
                            <>
                                {/* --- Nominee Fields First --- */}
                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Nominee Name</label>
                                        <input className="kyc-input" type="text" placeholder="Nominee Name" />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Nominee SurName</label>
                                        <input className="kyc-input" type="text" placeholder="Nominee SurName" />
                                    </div>
                                </div>

                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Date of Birth</label>
                                        <input className="kyc-input" type="date" />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Gender</label>
                                        <div className="kyc-radio-group">
                                            <label><input type="radio" name="nominee-gender" value="male" /> Male</label>
                                            <label><input type="radio" name="nominee-gender" value="female" /> Female</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Address Proof</label>
                                        <label className="kyc-label">Address Proof</label>
                                        <select
                                            className="kyc-input"
                                            value={addressProof}
                                            onChange={(e) => setAddressProof(e.target.value)}
                                        >
                                            <option value="">Select Address Proof</option>
                                            <option value="aadhar">Aadhar</option>
                                            <option value="passport">Passport</option>
                                            <option value="driving">Driving License</option>
                                            <option value="voterid">Voter ID</option>
                                            <option value="others">Others</option>
                                        </select>


                                    </div>
                                </div>

                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Upload Address Proof</label>
                                        <input className="kyc-input" type="file" accept="image/*,application/pdf" />
                                    </div>
                                </div>

                                <button
                                    className="primary-button kyc-submit-btn"
                                    onClick={() => setIsNomineeVerified(true)}
                                >
                                    Verify and Proceed <FaChevronRight />
                                </button>
                            </>
                        ) : (
                            <>
                                <label className="kyc-label">Upload a Selfie</label>
                                <input className="kyc-input" type="file" accept="image/*" />
                                <div>
                                <p className="kyc-heading">Signature</p>
                                <label className="kyc-label">Upload Signature</label>
                                <input className="kyc-input" type="file" accept="image/*,application/pdf" />
                                <p>OR</p>
                                <label className="kyc-label">Sign Here</label>
                                <div className="signature-pad-wrapper">
                                    <SignaturePad
                                        ref={sigPadRef}
                                        canvasProps={{
                                            className: "signature-canvas"
                                        }}
                                    />
                                    <button type="button" onClick={clearSignature}>Clear</button>
                                    <button type="button" onClick={saveSignature}>Save</button>
                                </div>
                                </div>

                                <button className="primary-button kyc-submit-btn">
                                    Submit
                                </button>
                            </>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
};

export default KYCPage;
