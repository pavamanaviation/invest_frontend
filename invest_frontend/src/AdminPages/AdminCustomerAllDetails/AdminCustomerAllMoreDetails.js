import React from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdInsertDriveFile } from "react-icons/md";
import sampleImage from "../../assets/dummy-image.png";

const CustomerMoreDetails = () => {
  const navigate = useNavigate();

  // Dummy placeholders for now
  const customer = {
    selfie: "",
    signature: "",
  };

  const renderFileIcon = () => (
    <MdInsertDriveFile className="file-icon" title="View File" style={{ cursor: "pointer" }} />
  );

  return (
    <div className="admin-customer-container admin-customer-more-container">
      <div className="admin-customer-top-div">
        <div className="admin-back-div" onClick={() => navigate(-1)}>
          <MdKeyboardArrowLeft />
          <button className="admin-back-btn">Back</button>
        </div>
        <div className="admin-customer-heading">Customer Full Details</div>
      </div>

      <div className="admin-customer-info">
        {/* PERSONAL INFO */}
        <div className="admin-info-section personal-with-selfie">
          <div className="admin-section-title">Personal Information</div>
          <div className="admin-personal-selfie-wrapper">
            <div className="admin-personal-details">
              {[
                ["Name", "—"],
                ["Date of Birth", "—"],
                ["Gender", "—"],
                ["Profession", "—"],
                ["Designation", "—"],
              ].map(([label, value], idx) => (
                <div className="admin-info-row" key={idx}>
                  <div className="admin-info-item">
                    <div className="admin-info-item-label">{label}:</div>
                    <div className="admin-info-item-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-selfie-display">
              <img
                src={sampleImage}
                alt="Selfie"
                className="admin-selfie-img"
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="admin-info-section">
          <div className="admin-section-title">Contact Information</div>
          {[
            ["Email", "—"],
            ["Mobile", "—"],
            ["Permanent Address", "—"],
            ["Present Address", "—"],
          ].map(([label, value], idx) => (
            <div className="admin-info-row" key={idx}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* SIGNATURE */}
        <div className="admin-info-section">
          <div className="admin-section-title">Signature</div>
          <div className="admin-info-row">
            <div className="admin-info-item">
              <div className="admin-info-item-label">Signature:</div>
              <div className="admin-info-item-value">
                <img
                  src={ sampleImage}
                  alt="Signature"
                  className="admin-sign-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KYC SECTION */}
        <div className="admin-info-section">
          <div className="admin-section-title">KYC Details</div>
          {[
            ["PAN Number", "—"],
            ["PAN Status", "Pending"],
            ["PAN File", renderFileIcon()],
            ["Aadhar Number", "—"],
            ["Aadhar Status", "Pending"],
            ["Aadhar File", renderFileIcon()],
          ].map(([label, value], idx) => (
            <div className="admin-info-row" key={idx}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PAYMENT DETAILS */}
        <div className="admin-info-section">
          <div className="admin-section-title">Payment Details</div>
          {[
            ["Payment Mode", "—"],
            ["Amount", "—"],
            ["Transaction ID", "—"],
            ["Payment Date", "—"],
          ].map(([label, value], idx) => (
            <div className="admin-info-row" key={idx}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* BANK DETAILS */}
        <div className="admin-info-section">
          <div className="admin-section-title">Bank Details</div>
          {[
            ["Bank Name", "—"],
            ["Account Number", "—"],
            ["IFSC Code", "—"],
            ["Account Status", "—"],
          ].map(([label, value], idx) => (
            <div className="admin-info-row" key={idx}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* NOMINEE SECTION */}
        <div className="admin-info-section">
          <div className="admin-section-title">Nominee Details</div>
          {[
            ["Name", "—"],
            ["DOB", "—"],
            ["Gender", "—"],
            ["Relation", "—"],
            ["Address Proof", renderFileIcon()],
            ["ID Proof", renderFileIcon()],
          ].map(([label, value], idx) => (
            <div className="admin-info-row" key={idx}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerMoreDetails;
