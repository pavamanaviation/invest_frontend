import React, { use, useState } from "react";
import "./KYC.css";
import { FaChevronRight } from "react-icons/fa";
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import SelfieCapture from "../../components/SelfieCapture/SelfieCapture";
import { verifyPan, verifyAadhar } from "../../apis/kycApi";

const KYCPage = () => {
    const customer_id = sessionStorage.getItem("customer_id");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    const [step, setStep] = useState("identity"); // identity, bank, personal, others
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [isAadharVerified, setIsAadharVerified] = useState(false);
    const [isNomineeVerified, setIsNomineeVerified] = useState(false);
    const [addressProof, setAddressProof] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [profession, setProfession] = useState("");


    const stepOrder = (s) => {
        const order = ["identity", "bank", "personal", "others"];
        return order.indexOf(s);
    };
    const handlePanVerify = async () => {
        if (!customer_id) {
            setPopup({ isOpen: true, message: "Please Login to proceed for KYC", type: "error" });
            return;
        } else if (!panNumber) {
            setPopup({ isOpen: true, message: "Please enter PAN number", type: "error" });

            return;
        }

        setLoading("true");

        try {
            const response = await verifyPan({ pan_number: panNumber, customer_id: customer_id });

            if (response.pan_status === 1) {
                setPopup({ isOpen: true, message: "PAN verification succesful", type: "success" });

                setIsPanVerified(true);
                setPanNumber(""); // Clear PAN input field
            } else {
                alert("PAN verification failed. Please check your details.");
            }
        } catch (error) {
            console.error("PAN verification failed:", error);
            // alert("PAN verification failed. Please try again.");
            setPopup({ isOpen: true, message: "PAN verification failed. Please try again.", type: "error" });
        }
        finally {
            setLoading(false);
        }
    };

    // const handleAadharVerify = () => {
    //     // Add your Aadhar validation logic here
    //     setIsAadharVerified(true);
    //     setStep("bank");
    // };

    const handleAadharVerify = async () => {
        if (!aadharNumber) {
            setPopup({ isOpen: true, message: "Please enter Aadhaar number", type: "error" });
            return;
        }else  if (!customer_id) {
            setPopup({ isOpen: true, message: "Please Login to proceed for KYC", type: "error" });
            return;
        }

        setLoading(true);

        try {
            const result = await verifyAadhar({ aadhar_number: aadharNumber, customer_id });

            const status = result?.aadhar_status;

            if (status === 1) {
                setPopup({ isOpen: true, message: "Aadhaar verification successful", type: "success" });
                setIsAadharVerified(true);
                setStep("bank");
                setAadharNumber("");
            } else {
                setPopup({ isOpen: true, message: "Aadhaar verification failed", type: "error" });
            }
        } catch (error) {
            console.error("Aadhaar verification error:", error);
            setPopup({ isOpen: true, message: error?.message || "Verification error", type: "error" });
        } finally {
            setLoading(false);
        }
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
                                <input className="kyc-input" type="text" placeholder="Your PAN Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
                                <button className="primary-button kyc-submit-btn" onClick={handlePanVerify}>
                                    Verify and Proceed <FaChevronRight />
                                </button>
                            </>
                        ) : !isAadharVerified ? (
                            <>
                                <label className="kyc-label">Verify Aadhar Number</label>
                                <input className="kyc-input" type="text" placeholder="Your Aadhar Number" value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} />
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
                                <select className="kyc-input" value={profession} onChange={(e) => setProfession(e.target.value)}>
                                    <option value="">Select Profession</option>
                                    <option value="private">Salaried - Private Sector</option>
                                    <option value="government">Salaried - Government Sector</option>
                                    <option value="professional">Self-employed - Professional</option>
                                    <option value="business">Self-employed - Business</option>
                                    <option value="student">Student</option>
                                    <option value="retired">Retired</option>
                                    <option value="homemaker">Homemaker</option>
                                    <option value="freelancer">Freelancer</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="engineer">Engineer</option>
                                    <option value="lawyer">Lawyer</option>
                                    <option value="accountant">CA / Accountant</option>
                                    <option value="teacher">Teacher / Professor</option>
                                    <option value="defence">Defence / Armed Forces</option>
                                    <option value="police">Police / Paramilitary</option>
                                    <option value="artist">Artist / Designer</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="others">Others</option>
                                </select>

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

                        {/* Address */}
                        <div className="kyc-row">
                            <div className="kyc-column-full">
                                <label className="kyc-label">Address</label>
                                <textarea className="kyc-input" placeholder="(Flatno./ Hno./ Street)"></textarea>
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
                                <SelfieCapture onCapture={(imageData) => console.log("Captured Selfie:", imageData)} />
                                <div>
                                    {/* <p className="kyc-heading">Signature</p> */}
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
                                        <div className="kyc-buttons-div">

                                            <button type="button" onClick={clearSignature}>Clear</button>
                                            <button type="button" onClick={saveSignature}>Save</button>
                                        </div>
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

            <PopupMessage
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />
        </div>
    );
};

export default KYCPage;
