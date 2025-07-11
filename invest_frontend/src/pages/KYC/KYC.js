import React, { useState, useEffect, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import SelfieCapture from "../../components/SelfieCapture/SelfieCapture";
import "./KYC.css";
import API_BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import KYCPreviewPopup from "../../components/KYCPreviewPopup/KYCPreviewPopup";
import { verifyPanDocument, getPanSourceVerificationStatus, verifyAadharDocument, getAadharVerificationStatus, getLocationByPincode, submitPersonalDetails } from "../../apis/kycApi";
import axios from "axios";

const KYCPage = () => {
    const navigate = useNavigate();
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
    const [district, setDistrict] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [permanentAddress, setPermanentAddress] = useState("");
    const [presentAddress, setPresentAddress] = useState("");
    const [sameAsPermanent, setSameAsPermanent] = useState(false);
    const [presentPincode, setPresentPincode] = useState("");
    const [presentLocationData, setPresentLocationData] = useState({
        city: "",
        mandal: "",
        district: "",
        state: "",
        country: ""
    });

    const [signFileName, setSignatureFileName] = useState("");


    // Add this useEffect at the top of your component
    useEffect(() => {
        const fetchCompletedStatus = async () => {
            try {
                const res = await axios.post(
                    `${API_BASE_URL}/completed-status`,
                    {},
                    { withCredentials: true }
                );

                const {
                    pan_status,
                    aadhar_status,
                    personal_status,
                    selfie_status,
                    signature_status,
                } = res.data;

                const statusObj = {
                    pan: pan_status ? 1 : 0,
                    aadhar: aadhar_status ? 1 : 0,
                    personal: personal_status ? 1 : 0,
                    others: (selfie_status && signature_status) ? 1 : 0,
                };

                setKycStatus(statusObj);

                // Auto-skip to next incomplete step
                if (!pan_status) setStep("pan");
                else if (!aadhar_status) setStep("aadhar");
                else if (!personal_status) setStep("personal");
                else if (!selfie_status || !signature_status) setStep("others");
            } catch (err) {
                console.error("Error fetching KYC status:", err);
            }
        };

        fetchCompletedStatus();
    }, []);

    useEffect(() => {
        const fetchCustomerProfile = async () => {
            try {
                const res = await axios.post(`${API_BASE_URL}/customer-profile`, {
                    action: "view",
                }, { withCredentials: true });

                const data = res.data;

                setFirstName(data.full_name);
                // setLastName(data.full_name?.split(" ")[1] || "");
                setEmail(data.email || "");
                setMobile(data.mobile_no || "");
                setDob(data.dob || "");
                setGender((data.gender || "").toLowerCase());
            } catch (err) {
                console.error("Failed to fetch customer profile:", err);
            }
        };

        fetchCustomerProfile();
    }, []);


    useEffect(() => {
        const fetchLocation = async () => {
            if (pincode.length === 6) {
                try {
                    const location = await getLocationByPincode(pincode);
                    console.log("Fetched location:", location);
                    setLocationData({
                        city: location.city || "",
                        mandal: location.mandal || "", // ensure mandal goes into locationData.mandal
                        district: location.district || "",
                        state: location.state || "",
                        country: location.country || "",
                    });
                    setCity(location.city || "");
                    setDistrict(location.district || "");
                    setState(location.state || "");
                    setCountry(location.country || "");
                    setMandal(location.mandal || "");

                } catch (err) {
                    setLocationData({
                        city: "",
                        mandal: "",
                        district: "",
                        state: "",
                        country: ""
                    });

                    setCity(""); setDistrict(""); setState(""); setCountry(""); setMandal("");
                }
            }
        };

        fetchLocation();
    }, [pincode]);

    useEffect(() => {
        const fetchPresentLocation = async () => {
            if (!sameAsPermanent && presentPincode.length === 6) {
                try {
                    const location = await getLocationByPincode(presentPincode);
                    setPresentLocationData({
                        city: location.city || "",
                        mandal: location.mandal || "",
                        district: location.district || "",
                        state: location.state || "",
                        country: location.country || "",
                    });
                } catch (err) {
                    setPresentLocationData({
                        city: "",
                        mandal: "",
                        district: "",
                        state: "",
                        country: "",
                    });
                }
            }
        };
        fetchPresentLocation();
    }, [presentPincode, sameAsPermanent]);

    const handlePanUpload = async () => {
        if (!panFile) {
            setPopup({ isOpen: true, type: "error", message: "Please upload a PAN file" });
            return;
        }

        try {
            const { status, data } = await verifyPanDocument(panFile);

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
            const { status, data } = await verifyAadharDocument(aadharFile);

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

    const handlePersonalSubmit = async () => {
        try {
            const payload = {
                customer_id: customerId,
                fullname: firstName,
                mobile_no: mobile,
                email: email,
                dob: dob,
                gender: gender,
                  profession: profession,
                  designation: designation,
                  company_name: companyName,
                address: permanentAddress,
                pincode: pincode,
                city: locationData.city,
                mandal: locationData.mandal,
                district: locationData.district,
                state: locationData.state,
                country: locationData.country,
                same_address: sameAsPermanent
            };

            if (!sameAsPermanent) {
                payload.present_address = presentAddress;
                payload.present_pincode = presentPincode;
                payload.present_city = presentLocationData.city;
                payload.present_mandal = presentLocationData.mandal;
                payload.present_district = presentLocationData.district;
                payload.present_state = presentLocationData.state;
                payload.present_country = presentLocationData.country;
            }


            const res = await submitPersonalDetails(payload);

            if (res.data?.action === "add_details") {
                setKycStatus(prev => ({ ...prev, personal: 1 }));
                setStep("others");
            }

            setPopup({ isOpen: true, message: res.data.message, type: "success" });
        } catch (err) {
            setPopup({
                isOpen: true,
                message: err?.response?.data?.error || "Submission failed",
                type: "error",
            });
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
            setPopup({
                isOpen: true,
                message: error?.response?.data?.error || error.message || "Failed to upload signature.",
                type: "error",
            })

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
            setPopup({
                isOpen: true,
                message: error?.response?.data?.error || error.message || "Failed to upload signature.",
                type: "error",
            });

        }
    };
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);


    const handlesubmit = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/preview-customer-details`, {}, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (response.data && response.data.customer) {
                setPreviewData(response.data);
                setShowPreview(true);
            }
        } catch (error) {
            setPopup({
                isOpen: true,
                message: error?.response?.data?.error || "Preview load failed.",
                type: "error",
            });
        }
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
                            onClick={handlePanUpload}
                            // onClick={setStep("aadhar")}
                            disabled={!panFile || kycStatus.pan === 1}
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
                            onClick={handleAadharUpload}

                            //   onClick={setStep("personal")}


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
                                <label className="kyc-label">Full Name</label>
                                <input className="kyc-input" type="text" placeholder="Full Name" value={firstName} disabled />
                            </div>
                            {/* <div className="kyc-column">
                                <label className="kyc-label">Last Name</label>
                                <input className="kyc-input" type="text" placeholder="Last Name" value={lastName} disabled />
                            </div> */}
                        </div>

                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Date of Birth</label>
                                <input className="kyc-input" type="date" value={dob} disabled />

                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Gender</label>
                                <div className="kyc-radio-group">
                                    <label><input type="radio" name="gender" value="male" checked={gender === "male"} disabled /> Male</label>
                                    <label><input type="radio" name="gender" value="female" checked={gender === "female"} disabled /> Female</label>
                                </div>
                            </div>
                        </div>

                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Mobile Number</label>
                                <input className="kyc-input" type="text" placeholder="Mobile Number" value={mobile} disabled />

                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Email</label>
                                <input className="kyc-input" type="email" placeholder="Email" value={email} disabled />
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
                                <label className="kyc-label">City/Village</label>
                                <input className="kyc-input" type="text" placeholder="City" value={locationData.city} onChange={(e) => setPincode(e.target.value)} />
                            </div>
                            <div className="kyc-column">
                                <label className="kyc-label">Mandal/Block</label>
                                <input
                                    className="kyc-input"
                                    type="text"
                                    placeholder="Mandal"
                                    value={mandal}
                                    onChange={(e) => setMandal(e.target.value)}
                                />


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
                        {/* Permanent Address */}
                        <div className="kyc-row">
                            <div className="kyc-column-full">
                                <label className="kyc-label">Permanent Address</label>
                                <textarea
                                    className="kyc-input"
                                    placeholder="(Flat No. / H.No. / Street / Area)"
                                    value={permanentAddress}
                                    onChange={(e) => setPermanentAddress(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Checkbox */}
                        <div className="kyc-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={sameAsPermanent}
                                    onChange={(e) => {
                                        setSameAsPermanent(e.target.checked);
                                        if (e.target.checked) {
                                            setPresentAddress(permanentAddress); // auto-copy
                                        } else {
                                            setPresentAddress(""); // reset if unchecked
                                        }
                                    }}
                                />{" "}
                                Is your present address same as permanent address?
                            </label>
                        </div>

                        {/* Present Address */}
                        {!sameAsPermanent && (
                            <>
                                <div className="kyc-row">
                                    <div className="kyc-column">
                                        <label className="kyc-label">Present Pincode</label>
                                        <input
                                            className="kyc-input"
                                            type="text"
                                            placeholder="Pincode"
                                            value={presentPincode}
                                            maxLength={6}
                                            onChange={(e) => setPresentPincode(e.target.value)}
                                        />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Present City/Village</label>
                                        <input className="kyc-input" value={presentLocationData.city} disabled />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Present Mandal/Block</label>
                                        <input className="kyc-input" value={presentLocationData.mandal} disabled />
                                    </div>
                                </div>

                                <div className="kyc-row three-columns">

                                    <div className="kyc-column">
                                        <label className="kyc-label">Present District</label>
                                        <input className="kyc-input" value={presentLocationData.district} disabled />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Present State</label>
                                        <input className="kyc-input" value={presentLocationData.state} disabled />
                                    </div>
                                    <div className="kyc-column">
                                        <label className="kyc-label">Present Country</label>
                                        <input className="kyc-input" value={presentLocationData.country} disabled />
                                    </div>
                                </div>


                                <div className="kyc-row">
                                    <div className="kyc-column-full">
                                        <label className="kyc-label">Present Address</label>
                                        <textarea
                                            className="kyc-input"
                                            placeholder="(Flat No. / H.No. / Street / Area)"
                                            value={presentAddress}
                                            onChange={(e) => setPresentAddress(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Next Step Button */}
                        <button className="primary-button kyc-submit-btn" onClick={handlePersonalSubmit}>
                            Verify and Proceed <FaChevronRight />
                        </button>

                    </div>
                )}

                {/* Step: Others */}
                {step === "others" && (
                    <div className="kyc-form-section">
                        <SelfieCapture onCapture={uploadSelfieToServer} />

                        <div className="kyc-row">
                            <div className="kyc-column">
                                <label className="kyc-label">Upload Signature</label>

                                <input
                                    type="file"
                                    id="signature"
                                    accept="image/*,application/pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setSignatureFileName(file.name);
                                            handleSignatureFileUpload(file);
                                        }
                                    }}
                                />

                                <div className="kyc-input address-input">
                                    <label htmlFor="signature" className="custom-file-button">Choose File</label>
                                    {signFileName && <div className="file-name-display">{signFileName}</div>}
                                </div>
                            </div>
                        </div>

                        <p>OR</p>

                        <label className="kyc-label">Sign Here</label>
                        <div className="signature-pad-wrapper">
                            <SignaturePad
                                ref={sigPadRef}
                                canvasProps={{ className: "signature-canvas" }}
                            />
                            <div className="kyc-buttons-div">
                                <button type="button" onClick={clearSignature}>Clear</button>
                                <button type="button" onClick={saveSignature}>Save</button>
                            </div>
                        </div>

                        <button className="primary-button kyc-submit-btn" onClick={handlesubmit}>
                            Submit
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

            {showPreview && previewData && (
                <KYCPreviewPopup
                    data={previewData}
                    onClose={() => setShowPreview(false)}
                    onConfirm={() => navigate("/customer-dashboard")}
                />
            )}


        </div>
    );
};

export default KYCPage;
