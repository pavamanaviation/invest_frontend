import React, { useEffect, useState } from "react";
import "./KYC.css";
import { FaChevronRight } from "react-icons/fa";
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import SelfieCapture from "../../components/SelfieCapture/SelfieCapture";
import { verifyPan, verifyAadhar, fetchCustomerProfile, getLocationByPincode } from "../../apis/kycApi";

const KYCPage = () => {
    const customer_id = sessionStorage.getItem("customer_id");
    const [loading, setLoading] = useState(false);
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    const [step, setStep] = useState("personal"); // identity, bank, personal, others
    const [isPanVerified, setIsPanVerified] = useState(false);
    const [isAadharVerified, setIsAadharVerified] = useState(false);
    const [isNomineeVerified, setIsNomineeVerified] = useState(false);
    const [addressProof, setAddressProof] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [profession, setProfession] = useState("");
    const [addressProofFileName, setAddressProofFileName] = useState("");
    const [signFileName, setSignatureFileName] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

const [pincode, setPincode] = useState("");
const [locationData, setLocationData] = useState({
  city: "",
  mandal: "",
  district: "",
  state: "",
  country: ""
});
    const stepOrder = (s) => {
        const order = ["personal", "identity", "bank", "others"];
        return order.indexOf(s);
    };

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const data = await fetchCustomerProfile();
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setMobile(data.mobile_no);
    } catch (err) {
      console.error("Profile fetch error:", err.message);
    }
  };

  fetchProfile();
}, []);

useEffect(() => {
  const fetchLocation = async () => {
    if (pincode.length === 6) {
      try {
        const location = await getLocationByPincode(pincode);
        setLocationData(location);
      } catch (err) {
        // Optional: set empty or error state
        setLocationData({
          city: "",
          mandal: "",
          district: "",
          state: "",
          country: ""
        });
      }
    }
  };

  fetchLocation();
}, [pincode]);

    const handlePersonalDetailsSubmit = () =>{

    }
    // const handlePersonalDetailsSubmit = async () => {
    //     const payload = {
    //         customer_id,
    //         first_name,
    //         last_name,
    //         dob,
    //         gender,
    //         mobile,
    //         email,
    //         profession,
    //         company_name,
    //         designation,
    //         pincode,
    //         mandal,
    //         address,
    //     };

    //     try {
    //         setLoading(true);
    //         const result = await savePersonalDetails(payload);
    //         setPopup({ isOpen: true, message: result.message, type: "success" });
    //         setStep("identity");
    //     } catch (error) {
    //         setPopup({ isOpen: true, message: error.message || "Error saving details", type: "error" });
    //     } finally {
    //         setLoading(false);
    //     }
    // };


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

    const handleAadharVerify = async () => {
        if (!aadharNumber) {
            setPopup({ isOpen: true, message: "Please enter Aadhaar number", type: "error" });
            return;
        } else if (!customer_id) {
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
                    {["personal", "identity", "bank", "others"].map((s, i) => (
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

                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Mobile Number</label>
                                <input className="kyc-input" type="text" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />

                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Email</label>
                                <input className="kyc-input" type="email" placeholder="Email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
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

                        <div className="kyc-row three-columns">
                            <div className="kyc-column">
                                <label className="kyc-label">Pincode</label>
                                <input className="kyc-input" type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6}/>
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">City</label>
                                <input className="kyc-input" type="text" placeholder="City" value={locationData.city} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Mandal</label>
                                <input className="kyc-input" type="text" placeholder="Mandal" value={locationData.mandal} />
                            </div>
                        </div>

                        <div className="kyc-row three-columns">
                            <div className="kyc-column">
                                <label className="kyc-label">District</label>
                                <input className="kyc-input" type="text" placeholder="District" value={locationData.district}  />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">State</label>
                                <input className="kyc-input" type="text" placeholder="State"  value={locationData.state} />
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
                                <textarea className="kyc-input" placeholder="(Flatno./ Hno./ Street)"></textarea>
                            </div>
                        </div>


                        {/* Next Step Button */}
                        <button className="primary-button kyc-submit-btn" 
                        // onClick={handlePersonalDetailsSubmit}

                        onClick={() => setStep("identity")}>
                            Verify and Proceed <FaChevronRight />
                        </button>

                    </div>
                )}

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

                                {/* <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Upload Address Proof</label>
                                        <input className="kyc-input" type="file" accept="image/*,application/pdf" />
                                    </div>
                                </div> */}
                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Upload Address Proof</label>

                                        <input
                                            type="file"
                                            id="addressProof"
                                            accept="image/*,application/pdf"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setAddressProofFileName(file.name);
                                                }
                                            }}
                                        />
                                        <div className="kyc-input address-input">

                                            <label htmlFor="addressProof" className="custom-file-button ">
                                                Choose File
                                            </label>

                                            {addressProofFileName && (
                                                <div className="file-name-display">{addressProofFileName}</div>
                                            )}
                                        </div>
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
                                    {/* <label className="kyc-label">Upload Signature</label>
                                    <input className="kyc-input" type="file" accept="image/*,application/pdf" /> */}
                                    <div className="kyc-row">
                                        <div className="kyc-column">
                                            <label className="kyc-label">Upload Signature</label>

                                            <input
                                                type="file"
                                                id="addressProof"
                                                accept="image/*,application/pdf"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setSignatureFileName(file.name);
                                                    }
                                                }}
                                            />
                                            <div className="kyc-input address-input">

                                                <label htmlFor="addressProof" className="custom-file-button ">
                                                    Choose File
                                                </label>

                                                {signFileName && (
                                                    <div className="file-name-display">{signFileName}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
