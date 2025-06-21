import React, { useEffect, useState } from "react";
import "./KYC.css";
import { FaChevronRight } from "react-icons/fa";
import SignaturePad from 'react-signature-canvas';
import { useRef } from 'react';
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import SelfieCapture from "../../components/SelfieCapture/SelfieCapture";
import { savePersonalDetails, verifyPan, verifyAadhar, fetchCustomerProfile, getLocationByPincode, verifyBank, uploadDocument, submitNomineeDetails } from "../../apis/kycApi";
import axios from "axios";
import API_BASE_URL from "../../../src/config";
import { useNavigate } from "react-router-dom";

const KYCPage = () => {
    const customer_id = sessionStorage.getItem("customer_id");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    const [step, setStep] = useState("personal"); // identity, bank, personal, others

    const [panFileName, setPanFileName] = useState("");
    const [aadharFileName, setAadharFileName] = useState("");

    const [isPanVerified, setIsPanVerified] = useState(false);
    const [panUploadDone, setPanUploadDone] = useState(false);
    const [isAadharVerified, setIsAadharVerified] = useState(false);
    const [aadharUploadDone, setAadharUploadDone] = useState(false);

    const [panNumber, setPanNumber] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    const [profession, setProfession] = useState("");


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
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");

    const stepOrder = (s) => {
        const order = ["personal", "identity", "bank", "others"];
        return order.indexOf(s);
    };

    const [nomineeFirstName, setNomineeFirstName] = useState("");
    const [nomineeLastName, setNomineeLastName] = useState("");
    const [nomineeDOB, setNomineeDOB] = useState("");
    const [nomineeGender, setNomineeGender] = useState(""); // if required by backend later
    const [nomineeRelation, setNomineeRelation] = useState("");
    const [idProofFile, setIdProofFile] = useState(null);
    const [addressProof, setAddressProof] = useState(""); // e.g. "aadhar", "passport"
    const [addressProofFile, setAddressProofFile] = useState(null);

    const [addressProofFileName, setAddressProofFileName] = useState("");
    const [signFileName, setSignatureFileName] = useState("");
    const [isNomineeVerified, setIsNomineeVerified] = useState(false);
    const [addressProofType, setAddressProofType] = useState("");
    const [idProofType, setIdProofType] = useState("pan");
    const [idProofFileName, setIdProofFileName] = useState("");
    const [kycStatus, setKycStatus] = useState({
        personal: 0,
        identity: 0,
        bank: 0,
        others: 0,
    });

useEffect(() => {
  const fetchAllStatuses = async () => {
    const customer_id = sessionStorage.getItem("customer_id");
    if (!customer_id) return;

    try {
      const personalRes = await axios.post(`${API_BASE_URL}/customer-more-details`, { customer_id }, { withCredentials: true });
      const panRes = await axios.post(`${API_BASE_URL}/verify-pan`, { customer_id }, { withCredentials: true });
      const aadharRes = await axios.post(`${API_BASE_URL}/verify-aadhar-lite`, { customer_id }, { withCredentials: true });
      const bankRes = await axios.post(`${API_BASE_URL}/verify-banck-account`, { customer_id }, { withCredentials: true });

      let nomineeStatus = 0;
      try {
        const nomineeRes = await axios.post(`${API_BASE_URL}/nominee-details`, { customer_id }, { withCredentials: true });
        nomineeStatus = nomineeRes.data.nominee_status === 1 ? 1 : 0;

        // ✅ Moved log inside try block where nomineeRes is defined
        console.log("Nominee Status from API:", nomineeRes.data.nominee_status);
      } catch (error) {
        console.warn("Nominee not yet added. Defaulting to 0 status.");
        nomineeStatus = 0;
      }

      const selfieRes = await axios.post(`${API_BASE_URL}/upload-pdf-document`, { customer_id, doc_type: "selfie" }, { withCredentials: true });
      const signatureRes = await axios.post(`${API_BASE_URL}/upload-pdf-document`, { customer_id, doc_type: "signature" }, { withCredentials: true });

      const updatedStatus = {
        personal: personalRes.data.customer_readonly_info.personal_status,
        identity: panRes.data.pan_status === 1 && aadharRes.data.aadhar_status === 1 ? 1 : 0,
        bank: bankRes.data.bank_status === 1 ? 1 : 0,
        others:
          nomineeStatus === 1 &&
          selfieRes.data.selfie_status === 1 &&
          signatureRes.data.signature_status === 1
            ? 1
            : 0,
      };

      setKycStatus(updatedStatus);

      console.log("Status breakdown", {
        nominee: nomineeStatus,
        selfie: selfieRes.data.selfie_status,
        signature: signatureRes.data.signature_status,
      });

      console.log("Final step:", updatedStatus);

      if (updatedStatus.personal !== 1) setStep("personal");
      else if (updatedStatus.identity !== 1) setStep("identity");
      else if (updatedStatus.bank !== 1) setStep("bank");
      else if (updatedStatus.others !== 1) setStep("others");

    } catch (error) {
      console.error("Failed to fetch KYC statuses", error);
    }
  };

  fetchAllStatuses();
}, []);

    useEffect(() => {
        if (step === "personal") {
            fetchCustomerProfile()
                .then((data) => {
                    setFirstName(data.first_name || "");
                    setLastName(data.last_name || "");
                    setEmail(data.email || "");
                    setMobile(data.mobile_no || "");
                })
                .catch((err) => {
                    // optionally show a toast or fallback UI
                    console.error("Could not auto-fill customer details");
                });
        }
    }, [step]);

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

    const normalizeMobile = (mobile) => {
        // Remove all non-digits, then add +91 prefix if not present
        const digits = mobile.replace(/\D/g, "");
        if (digits.length === 10) {
            return `+91${digits}`;
        } else if (digits.startsWith("91") && digits.length === 12) {
            return `+${digits}`;
        } else if (digits.length === 11 && digits.startsWith("0")) {
            return `+91${digits.slice(1)}`;
        }
        return mobile; // fallback, in case it's already normalized
    };

    const handlePersonalDetailsSubmit = async () => {
        const payload = {
            customer_id,
            first_name: firstName,
            last_name: lastName,
            dob,
            gender,
            mobile_no: normalizeMobile(mobile),
            email,
            profession,
            company_name: companyName,
            designation,
            pincode,
            mandal
        };

        try {
            setLoading(true);
            const result = await savePersonalDetails(payload);
            setPopup({ isOpen: true, message: result.message, type: "success" });
            setKycStatus(prev => ({ ...prev, personal: 1 }));
            setStep("identity");
        } catch (error) {
            setPopup({ isOpen: true, message: error.message || "Error saving details", type: "error" });
            if (error?.error === "Personal details already submitted. Please proceed to next step.") {
                setPopup({ isOpen: true, message: error.error, type: "info" });
                setStep("identity");
            } else {
                setPopup({
                    isOpen: true,
                    message: error?.message || "Uanble to verify perosonal details. Please try again.",
                    type: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };



    const handlePanVerify = async () => {
        if (!customer_id) {
            setPopup({ isOpen: true, message: "Please login to proceed with KYC.", type: "error" });
            return;
        }

        if (!panNumber) {
            setPopup({ isOpen: true, message: "Please enter your PAN number.", type: "error" });
            return;
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        if (!panRegex.test(panNumber)) {
            setPopup({
                isOpen: true,
                message: "Invalid PAN format. Format should be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)",
                type: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await verifyPan({ pan_number: panNumber, customer_id });

            if (response.pan_status === 1) {
                setPopup({ isOpen: true, message: "PAN verification successful.", type: "success" });
                setIsPanVerified(true);
                
                setPanNumber(""); // Clear input
            } else {
                setPopup({ isOpen: true, message: "PAN verification failed. Please check your details.", type: "error" });
            }
        } catch (error) {
            console.error("PAN verification error:", error);

            if (error?.error === "PAN verification already completed.Please proceed for next") {
                setPopup({ isOpen: true, message: error.error, type: "info" });
                setIsPanVerified(true);
            } else {
                setPopup({
                    isOpen: true,
                    message: error?.message || "PAN verification failed. Please try again.",
                    type: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePanUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !customer_id) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("customer_id", customer_id);
            formData.append("doc_type", "pan");
            formData.append("kyc_file", file);

            const response = await uploadDocument(formData); // assume this is your API call

            if (response?.status === "success") {
                setPopup({ isOpen: true, message: "PAN card uploaded successfully.", type: "success" });
                setPanUploadDone(true);
            } else {
                setPopup({ isOpen: true, message: "PAN upload failed.", type: "error" });
            }
        } catch (error) {
            console.error("PAN upload error:", error);
            setPopup({ isOpen: true, message: "Upload failed. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };


    const handleAadharVerify = async () => {
        if (!aadharNumber) {
            setPopup({ isOpen: true, message: "Please enter Aadhaar number", type: "error" });
            return;
        }

        if (!customer_id) {
            setPopup({ isOpen: true, message: "Please login to proceed with KYC", type: "error" });
            return;
        }

        const aadharRegex = /^[2-9]{1}[0-9]{11}$/;
        if (!aadharRegex.test(aadharNumber)) {
            setPopup({ isOpen: true, message: "Invalid Aadhaar format. It should be a 12-digit number not starting with 0 or 1.", type: "error" });
            return;
        }

        setLoading(true);

        try {
            const result = await verifyAadhar({ aadhar_number: aadharNumber, customer_id });

            const status = result?.aadhar_status;

            if (status === 1) {
                setPopup({ isOpen: true, message: "Aadhaar verification successful", type: "success" });
                setIsAadharVerified(true);
                if (aadharUploadDone) {
                    setStep("bank");
                }
                setAadharNumber("");
            } else {
                setPopup({ isOpen: true, message: "Aadhaar verification failed", type: "error" });
            }
        } catch (error) {
            console.error("Aadhaar verification error:", error);

            if (error?.error === "Aadhaar details already submitted. Please proceed to next step.") {
                setPopup({ isOpen: true, message: error.error, type: "info" });
                setIsAadharVerified(true);
                if (aadharUploadDone) {
                    setStep("bank");
                }
            } else {
                setPopup({
                    isOpen: true,
                    message: error?.message || "Aadhaar verification failed. Please try again.",
                    type: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };
    const handleAadharUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !customer_id) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("customer_id", customer_id);
            formData.append("doc_type", "aadhar");
            formData.append("kyc_file", file);

            const response = await uploadDocument(formData);

            if (response?.status === "success") {
                setPopup({ isOpen: true, message: "Aadhaar uploaded successfully.", type: "success" });
                setAadharUploadDone(true);
                setStep("bank"); // ✅ Move to next step automatically
            } else {
                setPopup({ isOpen: true, message: "Aadhaar upload failed.", type: "error" });
            }
        } catch (error) {
            console.error("Aadhaar upload error:", error);
            setPopup({ isOpen: true, message: "Upload failed. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };


    const handleBankVerify = async () => {
        if (!accountNumber || !ifscCode) {
            setPopup({ isOpen: true, message: "Please fill in both account number and IFSC code", type: "error" });
            return;
        }

        if (!customer_id) {
            setPopup({ isOpen: true, message: "Please login to continue", type: "error" });
            return;
        }

        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(ifscCode)) {
            setPopup({ isOpen: true, message: "Invalid IFSC code format", type: "error" });
            return;
        }


        setLoading(true);
        try {
            const result = await verifyBank({ account_number: accountNumber, ifsc: ifscCode, customer_id });

            if (result.bank_status === 1) {
                setPopup({ isOpen: true, message: "Bank verification successful", type: "success" });
                setStep("others");
            } else {
                setPopup({ isOpen: true, message: "Bank verification failed. Please check details.", type: "error" });
            }
        } catch (error) {
            if (error?.error === "Bank details already submitted. Please proceed to next step.") {
                setPopup({ isOpen: true, message: error.error, type: "info" });
                setStep("others");
            } else {
                setPopup({ isOpen: true, message: error.message || "Bank verification failed.", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNomineeSubmit = async () => {
        const formData = new FormData();
        
        formData.append("first_name", nomineeFirstName);
        formData.append("last_name", nomineeLastName);
        formData.append("relation", nomineeRelation);
        formData.append("dob", nomineeDOB);
        formData.append("address_proof", addressProofType);
        formData.append("id_proof", idProofType); // can be fixed as "pan" if you're only allowing PAN
        formData.append("address_proof", addressProofType);

        if (addressProofFile) {
            formData.append("address_proof_file", addressProofFile);
        }

        if (idProofFile) {
            formData.append("id_proof_file", idProofFile);
        }

        try {
            const result = await submitNomineeDetails(formData);
            console.log("Nominee submitted:", result);
            setPopup({ isOpen: true, message: "Nominee Updtaed Succesfully", type: "success" });
            setIsNomineeVerified(true);
        } catch (error) {
            if (error?.error === "Nominee details already submitted. Please proceed to next step.") {
                setPopup({ isOpen: true, message: error.error, type: "info" });
                setStep("others");
            } else {
                setPopup({ isOpen: true, message: error.message || "Nominee updation failed.", type: "error" });
            }

        }
    };

    const uploadSelfieToServer = async (imageDataUrl) => {
        try {
            const blob = await fetch(imageDataUrl).then(res => res.blob());
            const selfieFile = new File([blob], "selfie.png", { type: "image/png" });

            const formData = new FormData();
            formData.append("customer_id", sessionStorage.getItem("customer_id"));
            formData.append("doc_type", "selfie");
            formData.append("kyc_file", selfieFile);

            const response = await axios.post(`${API_BASE_URL}/upload-pdf-document`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });


            if (response.data.status === "success") {
                setPopup({ isOpen: true, message: "Selfie captured successfully.", type: "success" });
            }
        } catch (error) {
            console.error("Selfie upload failed:", error);
            setPopup({ isOpen: true, message: error || "Failed to upload ", type: "error" });

        }
    };


    const sigPadRef = useRef();

    const clearSignature = () => {
        sigPadRef.current.clear();
    };

    const [signatureUploaded, setSignatureUploaded] = useState(false);
    const saveSignature = async () => {
        const dataUrl = sigPadRef.current.toDataURL(); // base64 image

        try {
            const blob = await fetch(dataUrl).then(res => res.blob());
            const signatureFile = new File([blob], "signature.png", { type: "image/png" });

            const formData = new FormData();
            formData.append("customer_id", sessionStorage.getItem("customer_id"));
            formData.append("doc_type", "signature");
            formData.append("kyc_file", signatureFile);

            const response = await axios.post(`${API_BASE_URL}/upload-pdf-document`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.data.status === "success") {
                setSignatureUploaded(true);
                console.log("✅ Signature uploaded:", response.data);
                setPopup({ isOpen: true, message: "Signature uploaded successfully.", type: "success" });

            }

        } catch (error) {
            console.error(" Signature upload failed:", error);
            setPopup({ isOpen: true, message: error || "Failed to upload ", type: "error" });

        }
    };

    const handleSignatureFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("customer_id", sessionStorage.getItem("customer_id"));
        formData.append("doc_type", "signature");
        formData.append("kyc_file", file);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload-pdf-document`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (response.data.status === "success") {
                setPopup({ isOpen: true, message: "Signature uploaded successfully.", type: "success" });
            }
        } catch (error) {
            console.error(" Signature file upload failed:", error);
            setPopup({ isOpen: true, message: error || "Failed to upload ", type: "error" });

        }
    };


    const handlesubmit = () => {
        setPopup({ isOpen: true, message: "KYC Completed.", type: "success" });
        setTimeout(() => navigate("/customer-dashboard"), 3000);

    }
    return (
        <div className="kyc-container container">
            <div className="kyc-header">
                <h2>Complete KYC</h2>
            </div>

            <div className="kyc-content">
                <div className="kyc-stepper">
                    {/* {["personal", "identity", "bank", "others"].map((s, i) => (
                        <div
                            key={s}
                            className={`kyc-step-wrapper ${step === s ? "active" : stepOrder(step) > i ? "completed" : "disabled"
                                }`}
                        >
                            <div className="kyc-step-circle" />
                            <div className="kyc-step-label">{s.charAt(0).toUpperCase() + s.slice(1)}</div>
                        </div>
                    ))} */}

                    {["personal", "identity", "bank", "others"].map((s) => (
                        <div
                            key={s}
                            className={`kyc-step-wrapper ${step === s ? "active" : kycStatus[s] === 1 ? "completed" : "disabled"
                                }`}
                        >
                            <div className="kyc-step-circle" />
                            <div className="kyc-step-label">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </div>
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


                        {/* Next Step Button */}
                        <button className="primary-button kyc-submit-btn"
                            onClick={handlePersonalDetailsSubmit}
                        >
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
                        ) : !panUploadDone ? (
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
                                            setPanFileName(file.name);
                                            handlePanUpload(e); // ✅ Trigger upload
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

                        ) : !isAadharVerified ? (
                            <>
                                <label className="kyc-label">Verify Aadhar Number</label>
                                <input className="kyc-input" type="text" placeholder="Your Aadhar Number" value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} />
                                <button className="primary-button kyc-submit-btn"
                                    onClick={handleAadharVerify}
                                >
                                    Verify and Proceed <FaChevronRight />
                                </button>
                            </>
                        ) : !aadharUploadDone ? (
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
                                            setAadharFileName(file.name);
                                            handleAadharUpload(e); // ✅ Trigger upload
                                        }
                                        // ✅ Allow re-selection of same file
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
                        )
                            : null}
                    </div>
                )}


                {step === "bank" && (
                    <div className="kyc-form-section">
                        <label className="kyc-label">Bank Account Number</label>
                        <input
                            className="kyc-input"
                            type="text"
                            placeholder="Enter Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                        />
                        <label className="kyc-label">IFSC Code</label>
                        <input
                            className="kyc-input"
                            type="text"
                            placeholder="Enter IFSC Code"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        />
                        <button className="primary-button kyc-submit-btn" onClick={handleBankVerify}>
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
                                        <input className="kyc-input" type="text" placeholder="Nominee Name" value={nomineeFirstName} onChange={(e) => setNomineeFirstName(e.target.value)} />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Nominee LastName</label>
                                        <input className="kyc-input" type="text" placeholder="Nominee LastName" value={nomineeLastName} onChange={(e) => setNomineeLastName(e.target.value)} />
                                    </div>
                                </div>

                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Date of Birth</label>
                                        <input className="kyc-input" type="date" value={nomineeDOB} onChange={(e) => setNomineeDOB(e.target.value)} />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Gender</label>
                                        <div className="kyc-radio-group">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="nominee-gender"
                                                    value="male"
                                                    checked={nomineeGender === "male"}
                                                    onChange={(e) => setNomineeGender(e.target.value)}
                                                /> Male
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="nominee-gender"
                                                    value="female"
                                                    checked={nomineeGender === "female"}
                                                    onChange={(e) => setNomineeGender(e.target.value)}
                                                /> Female
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Relation</label>
                                        <select
                                            className="kyc-input"
                                            value={nomineeRelation}
                                            onChange={(e) => setNomineeRelation(e.target.value)}
                                        >
                                            <option value="">Select Relation</option>
                                            <option value="spouse">Spouse</option>
                                            <option value="father">Father</option>
                                            <option value="mother">Mother</option>
                                            <option value="brother">Brother</option>
                                            <option value="sister">Sister</option>
                                        </select>



                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Upload ID Proof(only PAN Card)</label>

                                        <input
                                            type="file"
                                            id="nomineeidproof"
                                            accept="image/*,application/pdf"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setIdProofFile(file); // store file itself
                                                    setIdProofFileName(file.name); // or a separate ID proof name
                                                }
                                            }}
                                        />
                                        <div className="kyc-input address-input">
                                            <label htmlFor="nomineeidproof" className="custom-file-button">Choose File</label>
                                            {idProofFileName && <div className="file-name-display">{idProofFileName}</div>}

                                        </div>

                                    </div>

                                </div>
                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Address Proof</label>
                                        <select
                                            className="kyc-input"
                                            value={addressProofFile}
                                            onChange={(e) => setAddressProofType(e.target.value)}

                                        >
                                            <option value="">Select Address Proof</option>
                                            <option value="aadhar">Aadhar</option>
                                            <option value="passport">Passport</option>
                                            <option value="driving">Driving License</option>
                                            <option value="voterid">Voter ID</option>
                                            <option value="others">Others</option>
                                        </select>


                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Upload Address Proof</label>

                                        <input
                                            type="file"
                                            id="nomineeaddressProof"
                                            accept="image/*,application/pdf"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setAddressProofFile(file); // store file itself
                                                    setAddressProofFileName(file.name); // update filename
                                                }
                                            }}
                                        />
                                        <div className="kyc-input address-input">
                                            <label htmlFor="nomineeaddressProof" className="custom-file-button">Choose File</label>
                                            {addressProofFileName && <div className="file-name-display">{addressProofFileName}</div>}
                                        </div>

                                    </div>

                                </div>

                                <button
                                    className="primary-button kyc-submit-btn"
                                    onClick={handleNomineeSubmit}
                                >
                                    Verify and Proceed <FaChevronRight />
                                </button>
                            </>
                        ) : (
                            <>
                                <SelfieCapture onCapture={uploadSelfieToServer} />
                                <div>
                                    <div className="kyc-row">
                                        <div className="kyc-column">
                                            <label className="kyc-label">Upload Signature</label>

                                            <input
                                                type="file"
                                                id="selfie"
                                                accept="image/*,application/pdf"
                                                style={{ display: "none" }}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setSignatureFileName(file.name);
                                                        handleSignatureFileUpload(file); // <-- upload here
                                                    }
                                                }}

                                            />
                                            <div className="kyc-input address-input">

                                                <label htmlFor="selfie" className="custom-file-button ">
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
                                {/* {signatureUploaded && <p className="success-message">Signature uploaded successfully ✅</p>} */}
                                <button className="primary-button kyc-submit-btn" onClick={handlesubmit}>
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
