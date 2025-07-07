import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import "./BankNomineeFormPage.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const BankNomineeFormPage = () => {
  const [activeTab, setActiveTab] = useState("bank");
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });

  // BANK DETAILS
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankHolderName, setBankHolderName] = useState("");
  const [bankVerified, setBankVerified] = useState(false);
  const [bankError, setBankError] = useState("");
  const [loading, setLoading] = useState(false);

  // NOMINEE DETAILS
  const [nominees, setNominees] = useState([
    {
      name: "",
      relation: "",
      dob: "",
      gender: "",
      share_percentage: "",
      id_proof: null,
      id_proof_name: "",
      address_proof_type: "",
      address_proof: null,
      address_proof_name: "",
    },
  ]);

  const [activeNomineeIndex, setActiveNomineeIndex] = useState(0);

  const bankList = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank",
    "Punjab National Bank", "Bank of Baroda", "Canara Bank",
    "Union Bank of India", "IDBI Bank", "Kotak Mahindra Bank",
    "Indian Bank", "Yes Bank", "IndusInd Bank", "Bank of India",
    "UCO Bank", "Central Bank of India", "Indian Overseas Bank",
    "Bank of Maharashtra", "Federal Bank", "South Indian Bank", "Karur Vysya Bank"
  ];

  const handleBankVerify = async () => {
    setLoading(true);
    setBankError("");
    setBankHolderName("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-bank-account`,
        {
          account_number: accountNumber,
          ifsc: ifsc,
          bank_name: selectedBank,
        },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.action === "verify") {
        setBankHolderName(data.bank_holder_name);
        setBankVerified(true);
        setPopup({
          isOpen: true,
          message: "Bank Details verified successfully",
          type: "success",
        });
      } else {
        setBankHolderName(data.bank_holder_name || "");
        setBankVerified(false);
        setPopup({
          isOpen: true,
          message: data.message || "Bank verification failed.",
          type: "error",
        });
      }
    } catch (error) {
      setBankVerified(false);
      setPopup({
        isOpen: true,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Server error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }

  };

  const addNewNominee = () => {
    setNominees([
      ...nominees,
      {
        name: "",
        relation: "",
        dob: "",
        gender: "",
        id_proof: null,
        address_proof: null,
      },
    ]);
  };

  const updateNominee = (index, field, value) => {
    const updated = [...nominees];
    updated[index][field] = value;
    setNominees(updated);
  };

  const handleNomineeSubmit = async () => {
    const formData = new FormData();

    nominees.forEach((n, i) => {
      formData.append(`nominees[${i}][name]`, n.name);
      formData.append(`nominees[${i}][relation]`, n.relation);
      formData.append(`nominees[${i}][dob]`, n.dob);
      formData.append(`nominees[${i}][gender]`, n.gender);
      formData.append(`nominees[${i}][id_proof]`, n.id_proof);
      formData.append(`nominees[${i}][address_proof]`, n.address_proof);
      formData.append(`nominees[${i}][share_percentage]`, n.share_percentage);
      formData.append(`nominees[${i}][address_proof_type]`, n.address_proof_type);

    });

    try {
      await axios.post(`${API_BASE_URL}/submit-nominee`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPopup({
        isOpen: true,
        message: "Nominee details submitted successfully!",
        type: "success",
      });
    } catch (err) {
      setPopup({
        isOpen: true,
        message: "Failed to submit nominee details.",
        type: "error",
      });
    }

  };


  const removeNominee = (index) => {
    const updated = [...nominees];
    updated.splice(index, 1);
    setNominees(updated);
  };


  return (
    <div className="bank-nominee-container container">
      <div className="kyc-header">Bank and Nominee Details</div>
      <div className="tab-header">
        <button className={activeTab === "bank" ? "active" : ""} onClick={() => setActiveTab("bank")}>
          Bank Details
        </button>
        <button className={activeTab === "nominee" ? "active" : ""} onClick={() => setActiveTab("nominee")}>
          Nominee Details
        </button>
      </div>

      {/* BANK DETAILS */}
      {activeTab === "bank" && (
        <div className="form-section">

          <div className="form-group">
            <label className="kyc-label">Select Your Bank</label>
            <select className="kyc-input" value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
              <option value="">-- Select Bank --</option>
              {bankList.map((bank, idx) => (
                <option key={idx} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="kyc-label">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your bank account number"
              className="kyc-input"
            />
          </div>

          <div className="form-group">
            <label className="kyc-label">IFSC Code</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              placeholder="Enter IFSC code"
              className="kyc-input"
            />
          </div>

          {bankError && <div className="error-text">{bankError}</div>}

          <button className="primary-button" onClick={handleBankVerify} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Save"}
          </button>

          {bankVerified && (
            <div className="success-text">
              ✅ Bank verified successfully. Holder: <strong>{bankHolderName}</strong>
            </div>
          )}
        </div>
      )}

      {/* NOMINEE DETAILS */}
      {activeTab === "nominee" && (
        <div className="form-section">

          {nominees.map((nominee, index) => {
            const isActive = index === activeNomineeIndex;

            return (
              <div key={index} className={`nominee-block form-subsection ${isActive ? "expanded" : "collapsed"}`}>
                <div className="form-header" onClick={() => setActiveNomineeIndex(index)}>
                  <h3>Nominee {index + 1}</h3>
                  {!isActive && nominee.name && (
                    <span className="collapsed-name">({nominee.name})</span>
                  )}
                  {nominees.length > 1 && (
                    <div className="remove-button" onClick={(e) => {
                      e.stopPropagation(); // prevent collapse toggle
                      removeNominee(index);
                      if (index === activeNomineeIndex) setActiveNomineeIndex(0); // reset active if removed
                    }}>
                      ❌ Remove
                    </div>
                  )}
                </div>

                {isActive && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="kyc-label">Nominee Name</label>
                        <input
                          type="text"
                          value={nominee.name}
                          onChange={(e) => updateNominee(index, "name", e.target.value)}
                          className="kyc-input"
                          placeholder="Enter nominee name"
                        />
                      </div>

                      <div className="form-group">
                        <label className="kyc-label">Relation</label>
                        <input
                          type="text"
                          value={nominee.relation}
                          onChange={(e) => updateNominee(index, "relation", e.target.value)}
                          className="kyc-input"
                          placeholder="Enter relation"
                        />
                      </div>
                    </div>
                    <div className="form-row">

                      <div className="form-group">
                        <label className="kyc-label">Date of Birth</label>
                        <input
                          type="date"
                          value={nominee.dob}
                          onChange={(e) => updateNominee(index, "dob", e.target.value)}
                          className="kyc-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="kyc-label">Gender</label>
                        <div className="radio-group">
                          <label>
                            <input
                              type="radio"
                              name={`gender-${index}`}
                              value="male"
                              checked={nominee.gender === "male"}
                              onChange={(e) => updateNominee(index, "gender", e.target.value)}
                            />
                            Male
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`gender-${index}`}
                              value="female"
                              checked={nominee.gender === "female"}
                              onChange={(e) => updateNominee(index, "gender", e.target.value)}
                            />
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-row">

                      <div className="form-group">
                        <label className="kyc-label">(%) of Share</label>
                        <input
                          type="number"
                          value={nominee.share_percentage}
                          onChange={(e) => updateNominee(index, "share_percentage", e.target.value)}
                          className="kyc-input"
                          placeholder="Enter share percentage"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="form-group">
                        <label className="kyc-label">ID Proof (only PAN)</label>
                        <div className="kyc-input custom-upload-wrapper">
                          <label htmlFor={`id-proof-${index}`} className="custom-file-button">Choose File</label>
                          <input
                            type="file"
                            id={`id-proof-${index}`}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              updateNominee(index, "id_proof", file);
                              updateNominee(index, "id_proof_name", file?.name || "");
                            }}
                            className="hidden-file-input"
                            accept=".pdf,.png,.jpg,.jpeg"
                          />
                          {nominee.id_proof_name && <div className="file-name-display">{nominee.id_proof_name}</div>}
                        </div>
                      </div>

                    </div>

                    <div>
                    </div>
                    <div className="form-group">
                      <label className="kyc-label">Address Proof Type</label>
                      <select
                        value={nominee.address_proof_type}
                        onChange={(e) => updateNominee(index, "address_proof_type", e.target.value)}
                        className="kyc-input"
                      >
                        <option value="">-- Select Address Proof --</option>
                        <option value="aadhar">Aadhar</option>
                        <option value="passport">Passport</option>
                        <option value="driving">Driving License</option>
                        <option value="voterid">Voter ID</option>
                        <option value="others">Others</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="kyc-label">Upload Address Proof</label>
                      <div className="kyc-input custom-upload-wrapper">
                        <label htmlFor={`address-proof-${index}`} className="custom-file-button">Choose File</label>
                        <input
                          type="file"
                          id={`address-proof-${index}`}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            updateNominee(index, "address_proof", file);
                            updateNominee(index, "address_proof_name", file?.name || "");
                          }}
                          className="hidden-file-input"
                          accept=".pdf,.png,.jpg,.jpeg"
                        />
                        {nominee.address_proof_name && <div className="file-name-display">{nominee.address_proof_name}</div>}
                      </div>
                    </div>



                  </>
                )}
              </div>
            );
          })}


          <div>

            <div onClick={addNewNominee} className="add-nominee-btn">
              ➕ Add Nominee
            </div>


            <button className="primary-button" onClick={handleNomineeSubmit}>
              Submit Nominees
            </button>
          </div>
        </div>
      )}
      <PopupMessage
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />

    </div>
  );
};

export default BankNomineeFormPage;
