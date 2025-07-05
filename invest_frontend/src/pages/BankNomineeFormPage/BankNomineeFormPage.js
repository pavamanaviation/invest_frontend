import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";
import "./BankNomineeFormPage.css";

const BankNomineeFormPage = () => {
  const [activeTab, setActiveTab] = useState("bank");

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
      id_proof: null,
      address_proof: null,
    },
  ]);
  const [nomineeMessage, setNomineeMessage] = useState("");

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
        `${API_BASE_URL}/bank-account-verification`,
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
      } else {
        setBankHolderName(data.bank_holder_name || "");
        setBankVerified(false);
        setBankError(data.message || "Verification failed.");
      }
    } catch (error) {
      setBankVerified(false);
      setBankError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Server error"
      );
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
    });

    try {
      await axios.post(`${API_BASE_URL}/submit-nominee`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNomineeMessage("✅ Nominee details submitted successfully!");
    } catch (err) {
      setNomineeMessage("❌ Failed to submit nominee details.");
    }
  };

  return (
    <div className="bank-nominee-container">
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
          <h2>Bank Verification</h2>

          <div className="form-group">
            <label>Select Your Bank</label>
            <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
              <option value="">-- Select Bank --</option>
              {bankList.map((bank, idx) => (
                <option key={idx} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your bank account number"
            />
          </div>

          <div className="form-group">
            <label>IFSC Code</label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value)}
              placeholder="Enter IFSC code"
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
          <h2>Nominee Details</h2>

          {nominees.map((nominee, index) => (
            <div key={index} className="nominee-block">
              <h4>Nominee {index + 1}</h4>
              <div className="form-group">
                <label>Nominee Name</label>
                <input
                  type="text"
                  value={nominee.name}
                  onChange={(e) => updateNominee(index, "name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Relation</label>
                <input
                  type="text"
                  value={nominee.relation}
                  onChange={(e) => updateNominee(index, "relation", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={nominee.dob}
                  onChange={(e) => updateNominee(index, "dob", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
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

              <div className="form-group">
                <label>ID Proof</label>
                <input
                  type="file"
                  onChange={(e) =>
                    updateNominee(index, "id_proof", e.target.files[0])
                  }
                />
              </div>

              <div className="form-group">
                <label>Address Proof</label>
                <input
                  type="file"
                  onChange={(e) =>
                    updateNominee(index, "address_proof", e.target.files[0])
                  }
                />
              </div>

              <hr />
            </div>
          ))}

          <button className="secondary-button" onClick={addNewNominee}>
            ➕ Add Nominee
          </button>

          {nomineeMessage && <div className="success-text">{nomineeMessage}</div>}

          <button className="primary-button" onClick={handleNomineeSubmit}>
            Submit Nominees
          </button>
        </div>
      )}
    </div>
  );
};

export default BankNomineeFormPage;
