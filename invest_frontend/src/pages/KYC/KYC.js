import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import SelfieCapture from "../../components/SelfieCapture/SelfieCapture";
import "./KYC.css";
import API_BASE_URL from "../../config";

import SignaturePad from "react-signature-canvas";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { verifyPanDocument, getPanSourceVerificationStatus, verifyAadharDocument, getAadharVerificationStatus } from "../../apis/kycApi";


const KYCPage = () => {
    const customerId = sessionStorage.getItem("customer_id");
    const [step, setStep] = useState("pan");
    const [kycStatus, setKycStatus] = useState({
        pan: 0,
        aadhar: 0,
        personal: 0,
        others: 0,
    });

    const [panFile, setPanFile] = useState(null);
    const [panFileName, setPanFileName] = useState("");

    const [aadharFile, setAadharFile] = useState(null);
    const [aadharFileName, setAadharFileName] = useState("");

    const [popup, setPopup] = useState({ isOpen: false, message: "", type: "" });

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [designation, setDesignation] = useState('');
    const [address, setAddress] = useState('');

    const [pincode, setPincode] = useState("");
    const [locationData, setLocationData] = useState({
        city: "",
        mandal: "",
        district: "",
        state: "",
        country: ""
    });

    const [mandal, setMandal] = useState("");
    const [profession, setProfession] = useState("");
const handlePanUpload = async () => {
    if (!panFile) {
        setPopup({ isOpen: true, type: "error", message: "Please upload a PAN file" });
        return;
    }

    try {
        const { status, data } = await verifyPanDocument(customerId, panFile);

        if (status === 200 && data.status === "success") {
            setKycStatus(prev => ({ ...prev, pan: 1 }));
            setStep("aadhar");
            setPopup({ isOpen: true, type: "success", message: "PAN uploaded and verified!" });
        } else if (status === 202 && data.status === "pending") {
            setPopup({ isOpen: true, type: "info", message: "Verification in progress..." });
            setTimeout(() => pollPanStatus(data.request_id), 3000);
        } else {
            throw new Error(data.error || "PAN verification failed");
        }
    } catch (err) {
        setPopup({ isOpen: true, type: "error", message: err.message });
    }
};

const pollPanStatus = async (requestId) => {
    try {
        const { status, data } = await getPanSourceVerificationStatus(requestId, customerId);

        if (status === 200 && data.status === "verified") {
            setKycStatus(prev => ({ ...prev, pan: 1 }));
            setStep("aadhar");
            setPopup({ isOpen: true, type: "success", message: "PAN verified!" });
        } else if (status === 202) {
            setTimeout(() => pollPanStatus(requestId), 3000);
        } else {
            setPopup({ isOpen: true, type: "error", message: data.message || "Verification failed" });
        }
    } catch (err) {
        setPopup({ isOpen: true, type: "error", message: err.message });
    }
};

const handleAadharUpload = async () => {
  if (!aadharFile) {
    setPopup({ isOpen: true, type: "error", message: "Please upload Aadhaar file" });
    return;
  }

  try {
    const { status, data } = await verifyAadharDocument(customerId, aadharFile);

    if (status === 200 && data.status === "success") {
      setKycStatus(prev => ({ ...prev, aadhar: 1 }));
      setStep("personal");
      setPopup({ isOpen: true, type: "success", message: "Aadhaar verified successfully" });
    } else if (status === 202) {
      setPopup({ isOpen: true, type: "info", message: "Aadhaar verification in progress..." });
      setTimeout(() => pollAadharStatus(data.request_id), 3000);
    } else {
      throw new Error(data.message || "Aadhaar verification failed");
    }
  } catch (err) {
    setPopup({ isOpen: true, type: "error", message: err.message });
  }
};

const pollAadharStatus = async (requestId) => {
  try {
    const { status, data } = await getAadharVerificationStatus(requestId, customerId);

    if (status === 200 && data.status === "completed") {
      setKycStatus(prev => ({ ...prev, aadhar: 1 }));
      setStep("personal");
      setPopup({ isOpen: true, type: "success", message: "Aadhaar verified!" });
    } else if (status === 202) {
      setTimeout(() => pollAadharStatus(requestId), 3000);
    } else {
      setPopup({ isOpen: true, type: "error", message: data.message || "Aadhaar verification failed" });
    }
  } catch (err) {
    setPopup({ isOpen: true, type: "error", message: err.message });
  }
};

    const handlePersonalSubmit = () => {
        setKycStatus(prev => ({ ...prev, personal: 1 }));
        setStep("others");
    };

    const handleOthersSubmit = () => {
        setKycStatus(prev => ({ ...prev, others: 1 }));
        setPopup({ isOpen: true, message: "KYC Completed Successfully!", type: "success" });
    };

    const steps = [
        { key: "pan", label: "PAN Info" },
        { key: "aadhar", label: "Aadhar Info" },
        { key: "personal", label: "Personal Info" },
        { key: "others", label: "Others" },
    ];


    return (
        <div className="kyc-container container">
            <div className="kyc-header">
                <h2>Complete KYC</h2>
            </div>

            <div className="kyc-content">
                <div className="kyc-stepper">
                    {steps.map(s => (
                        <div
                            key={s.key}
                            className={`kyc-step-wrapper ${step === s.key
                                ? "active"
                                : kycStatus[s.key] === 1
                                    ? "completed"
                                    : "disabled"
                                }`}
                        >
                            <div className="kyc-step-circle" />
                            <div className="kyc-step-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Step: PAN */}
                {step === "pan" && (
                    <div className="kyc-form-section">
                        <div className="kyc-column">
                            <label className="kyc-label">Upload PAN Card</label>

                            <input
                                type="file"
                                id="panUpload"
                                accept="image/*,application/pdf"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setPanFile(file);
                                        setPanFileName(file.name);
                                    }
                                }}

                            />

                            <div className="kyc-input address-input">
                                <label htmlFor="panUpload" className="custom-file-button">
                                    Choose File
                                </label>
                                {panFileName && <div className="file-name-display">{panFileName}</div>}
                            </div>
                        </div>
                        <button
                            className="primary-button kyc-submit-btn"
                            // onClick={handlePanUpload}
                            onClick={setStep("aadhar")}
                            disabled={!panFile}
                        >
                            Verify & Continue <FaChevronRight />
                        </button>
                    </div>
                )}

                {/* Step: Aadhaar */}
                {step === "aadhar" && (
                    <div className="kyc-form-section">
                        <div className="kyc-column">
                            <label className="kyc-label">Upload Aadhaar Card</label>

                            <input
                                type="file"
                                id="aadharUpload"
                                accept="image/*,application/pdf"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setAadharFile(file);
                                        setAadharFileName(file.name);
                                    }
                                    e.target.value = null;
                                }}

                            />

                            <div className="kyc-input address-input">
                                <label htmlFor="aadharUpload" className="custom-file-button">
                                    Choose File
                                </label>
                                {aadharFileName && (
                                    <div className="file-name-display">{aadharFileName}</div>
                                )}
                            </div>
                        </div>
                        <button
                            className="primary-button kyc-submit-btn"
                            // onClick={handleAadharUpload}

                              onClick={      setStep("personal")}


                            disabled={!aadharFile}
                        >
                            Verify & Continue <FaChevronRight />
                        </button>
                    </div>
                )}

                {/* Step: Personal Info */}
                {step === "personal" && (
                    <div className="kyc-form-section">
                        {/* Name Row */}
                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">First Name</label>
                                <input className="kyc-input" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Last Name</label>
                                <input className="kyc-input" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Date of Birth</label>
                                <input className="kyc-input" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Gender</label>
                                <div className="kyc-radio-group">
                                    <label><input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} /> Male</label>
                                    <label><input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} /> Female</label>
                                </div>
                            </div>
                        </div>

                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Mobile Number</label>
                                <input className="kyc-input" type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />

                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Email</label>
                                <input className="kyc-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                                <input className="kyc-input" type="text" placeholder="Company / Firm Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Designation</label>
                                <input className="kyc-input" type="text" placeholder="Your Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />

                            </div>
                        </div>

                        <div className="kyc-row three-columns">
                            <div className="kyc-column">
                                <label className="kyc-label">Pincode</label>
                                <input className="kyc-input" type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">City</label>
                                <input className="kyc-input" type="text" placeholder="City" value={locationData.city} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Mandal</label>
                                <input className="kyc-input" type="text" placeholder="Mandal" value={locationData.mandal} onChange={(e) => setMandal(e.target.value)} />
                                {/* <input className="kyc-input" type="text" placeholder="Mandal" value={mandal} onChange={(e) => setMandal(e.target.value)} /> */}

                            </div>
                        </div>

                        <div className="kyc-row three-columns">
                            <div className="kyc-column">
                                <label className="kyc-label">District</label>
                                <input className="kyc-input" type="text" placeholder="District" value={locationData.district} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">State</label>
                                <input className="kyc-input" type="text" placeholder="State" value={locationData.state} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Country</label>
                                <input className="kyc-input" type="text" placeholder="Country" value={locationData.country} />
                            </div>
                        </div>
                        {/* Address */}
                        <div className="kyc-row">
                            <div className="kyc-column-full">
                                <label className="kyc-label">Address</label>
                                <textarea className="kyc-input" placeholder="(Flatno./ Hno./ Street)" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>
                        ``

                        {/* Next Step Button */}
                        <button className="primary-button kyc-submit-btn" onClick={handlePersonalSubmit()}>
                            Verify and Proceed <FaChevronRight />
                        </button>

                    </div>
                )}

                {/* Step: Others */}
                {step === "others" && (
                    <div className="kyc-form-section">
                        {/* Nominee Info, Selfie, Signature Pad */}
                        <SelfieCapture onCapture={() => { }} />
                        <SignaturePad canvasProps={{ className: "signature-canvas" }} />
                        <button
                            className="primary-button kyc-submit-btn"
                            onClick={handleOthersSubmit}
                        >
                            Submit KYC
                        </button>
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
