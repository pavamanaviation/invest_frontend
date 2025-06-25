import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import { MdKeyboardArrowLeft } from "react-icons/md";
import "../AdminCustomerDetails/AdminCustomerMoreDetails.css";
import "../AdminKYCDetails/AdminKYCDetails.css";

const AdminCustomerKYCMoreDetails = () => {
  const { id } = useParams();
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKYCDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin-customer-kyc-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "view_more",
            customer_id: id,
            admin_id: sessionStorage.getItem("admin_id"),
          }),
        });

        const data = await response.json();
        if (data.status === "success") {
          setKycData(data.kyc);
        } else {
          console.error("API error:", data.error);
        }
        setLoading(false);
      } catch (err) {
        console.error("Network error:", err);
        setLoading(false);
      }
    };

    fetchKYCDetails();
  }, [id]);

  if (loading) return <div className="customer-loader">Loading...</div>;
  if (!kycData) return <div className="customer-error">KYC details not found</div>;

  return (
    <div className="admin-customer-container admin-customer-more-container">
      <div className="admin-customer-top-div">
        <div className="admin-back-div" onClick={() => navigate(-1)}>
          <MdKeyboardArrowLeft />
          <button className="admin-back-btn">Back</button>
        </div>
        <div className="admin-customer-heading">KYC Details</div>
      </div>

      <div className="admin-customer-info">

        {/* PAN Information */}
        {/* <div className="admin-info-section">
          <div className="admin-section-title">PAN Information</div>
          <div className="admin-info-row">
            <div className="admin-info-item">
              <div className="admin-info-item-label">PAN Number:</div>
              <div className="admin-info-item-value">{kycData.pan_number || "-"}</div>
            </div>
            <div className="admin-info-item">
              <div className="admin-info-item-label">PAN Status:</div>
              <div className="admin-info-item-value">
                <div className={`admin-info-item-value status-text ${kycData.pan_status === 1
                    ? "verified"

                    : "pending"
                  }`}>
                  {kycData.pan_status === 1
                    ? "Verified"

                    : "Pending"}
                </div>

              </div>
            </div>
          </div>
          {kycData.pan_path && (
                         <div className="admin-doc-right">
  <img src={kycData.pan_path} alt="PAN" className="admin-doc-img" />
</div>
          )}
        </div> */}


        <div className="admin-info-section">
          <div className="admin-section-title">PAN Information</div>
          <div className="admin-info-row image-right-layout">
            <div className="admin-info-left">
              <div className="admin-info-item">
                <div className="admin-info-item-label">PAN Number:</div>
                <div className="admin-info-item-value">{kycData.pan_number || "-"}</div>
              </div>
              <div className="admin-info-item">
                <div className="admin-info-item-label">PAN Status:</div>
                <div className={`admin-info-item-value status-text ${kycData.pan_status === 1 ? "verified" : "not-verified"}`}>
                  {kycData.pan_status === 1 ? "Verified" : "Pending"}
                </div>
              </div>
              <div className="admin-info-item">
                <div className="admin-info-item-label">Submitted at :</div>
                <div className="admin-info-item-value">{}</div>
              </div>
            </div>
            {kycData.pan_path && (
              <div className="admin-doc-right">
                <img src={kycData.pan_path} alt="PAN" className="admin-doc-img" />
              </div>
            )}
          </div>
        </div>



        {/* AAdhar Information */}
        <div className="admin-info-section">
          <div className="admin-section-title">Aadhar Information</div>
          <div className="admin-info-row image-right-layout">
            <div className="admin-info-left">
              <div className="admin-info-item">
                <div className="admin-info-item-label">Aadhar Number:</div>
                <div className="admin-info-item-value">{kycData.aadhar_number || "-"}</div>
              </div>
              <div className="admin-info-item">
                <div className="admin-info-item-label">Aadhar Status:</div>
                <div className={`admin-info-item-value status-text ${kycData.aadhar_status === 1 ? "verified" : "not-verified"}`}>
                  {kycData.aadhar_status === 1 ? "Verified" : "Pending"}
                </div>
              </div>
                <div className="admin-info-item">
                <div className="admin-info-item-label">Submitted at :</div>
                <div className="admin-info-item-value">{}</div>
              </div>
            </div>
            {kycData.pan_path && (
              <div className="admin-doc-right">
                <img src={kycData.aadhar_path} alt="Aadhar" className="admin-doc-img" />
              </div>
            )}
          </div>
        </div>

        {/* Bank Information */}
        <div className="admin-info-section">
          <div className="admin-section-title">Bank Information</div>
          <div className="admin-info-row">
            <div className="admin-info-item">
              <div className="admin-info-item-label">Account Number:</div>
              <div className="admin-info-item-value">{kycData.bank_account_number || "-"}</div>
            </div>
            <div className="admin-info-item">
              <div className="admin-info-item-label">IFSC Code:</div>
              <div className="admin-info-item-value">{kycData.ifsc_code || "-"}</div>
            </div>
            <div className="admin-info-item">
              <div className="admin-info-item-label">Bank Status:</div>
              <div className="admin-info-item-value">
                <div className={`admin-info-item-value status-text ${kycData.bank_status === 1
                  ? "verified"

                  : "not-verified"
                  }`}>
                  {kycData.bank_status === 1
                    ? "Verified"

                    : "Pending"}
                </div>

              </div>
            </div>
              <div className="admin-info-item">
                <div className="admin-info-item-label">Submitted at :</div>
                <div className="admin-info-item-value">{}</div>
              </div>
          </div>
        </div>

        {/* Created At */}
        <div className="admin-info-section">
          <div className="admin-section-title">Submission Info</div>
          <div className="admin-info-row">
            <div className="admin-info-item">
              <div className="admin-info-item-label">Submitted At:</div>
              <div className="admin-info-item-value">{kycData.created_at}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerKYCMoreDetails;
