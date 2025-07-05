// Final KYCPreviewPopup.js with all fields
import React from "react";
import "./KYCPreviewPopup.css";

const KYCPreviewPopup = ({ data, onClose, onConfirm }) => {
    if (!data) return null;

    const { customer, kyc, personal_details, nominee } = data;

    return (
        <div className="kyc-preview-overlay">
            <div className="kyc-preview-form">
                <h2 className="kyc-preview-heading">KYC Application Preview</h2>

                <div className="kyc-grid-section">
                    <div className="kyc-info">
                        <h3>Personal Details</h3>
                        <p><strong>Name</strong> {kyc.pan_name}</p>
                        <p><strong>Date of Birth</strong> {kyc.pan_dob}</p>

                        <p><strong>Gender</strong> {kyc.aadhar_gender}</p>
                        <p><strong>Profession</strong> {personal_details.profession}</p>
                        <p><strong>Designation</strong> {personal_details.designation}</p>

                    </div>
                    <div className="kyc-img-box">
                        <label>Selfie</label>
                        <img src={personal_details.selfie_url} alt="Selfie" />
                    </div>
                </div>

                <div className="kyc-grid-section">
                    <div className="kyc-info">

                        <h3>Contact Info</h3>
                        <p><strong>Email</strong> {customer.email}</p>
                        <p><strong>Mobile</strong> {customer.mobile_no}</p>
                       
                    </div>
                </div>

                  <div className="kyc-grid-section">
                    <div className="kyc-info">

                        <h3>Address</h3>
                        <p><strong>Address</strong> {personal_details.address}</p>
                        <p><strong>City</strong> {personal_details.city}</p>
                        <p><strong>District</strong> {personal_details.district}</p>
                        <p><strong>Mandal</strong> {personal_details.mandal}</p>
                        <p><strong>State</strong> {personal_details.state}</p>
                        <p><strong>Country</strong> {personal_details.country}</p>
                        <p><strong>Pincode</strong> {personal_details.pincode}</p>
                    </div>
                </div>

                <div className="kyc-grid-section">
                    <div className="kyc-info">
                        <h3>PAN Details</h3>
                        <p><strong>PAN Number</strong> {kyc.pan_number}</p>
                        <p><strong>Name on PAN</strong> {kyc.pan_name}</p>
                        <p><strong>DOB</strong> {kyc.pan_dob}</p>
                    </div>
                    <div className="kyc-img-box">
                        <label>PAN Document</label>
                        <img src={kyc.pan_doc_url} alt="PAN" />
                    </div>
                </div>

                <div className="kyc-grid-section">
                    <div className="kyc-info">
                        <h3>Aadhaar Details</h3>
                        <p><strong>Aadhaar Number</strong> {kyc.aadhar_number}</p>
                        <p><strong>Gender</strong> {kyc.aadhar_gender}</p>
                    </div>
                    <div className="kyc-img-box">
                        <label>Aadhaar Document</label>
                        <img src={kyc.aadhar_doc_url} alt="Aadhaar" />
                    </div>
                </div>

                <div className="kyc-grid-section">
                    <div className="kyc-info">
                        <h3>Signature</h3>
                        <div className="kyc-img-box signature">
                            <label>Signature</label>
                            <img src={personal_details.signature_url} alt="Signature" />
                        </div>
                    </div>
                </div>

                <div className="kyc-preview-buttons">
                    <button className="secondary-button" onClick={onClose}>Close</button>
                    <button className="primary-button" onClick={onConfirm}>Confirm & Proceed</button>
                </div>
            </div>
        </div>
    );
};

export default KYCPreviewPopup;
