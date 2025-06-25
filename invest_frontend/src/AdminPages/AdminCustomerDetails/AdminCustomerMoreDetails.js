import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import "./AdminCustomerMoreDetails.css";
import { MdKeyboardArrowLeft } from "react-icons/md";
import sampleimage from "../../assets/dummy-image.png"
const AdminCustomerMoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin-customer-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: sessionStorage.getItem("admin_id"),
            action: "view_more",
            customer_id: id,
          }),
        });

        const data = await response.json();
        if (data.status === "success") {
          setCustomer(data.customer);
        } else {
          console.error("API error:", data.error);
        }
        setLoading(false);
      } catch (error) {
        console.error("Network error:", error);
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) return <div className="customer-loader">Loading...</div>;
  if (!customer) return <div className="customer-error">Customer not found</div>;

  return (
    <div className="admin-customer-container admin-customer-more-container">
      <div className="admin-customer-top-div">
        <div className="admin-back-div" onClick={() => navigate(-1)}>
          <MdKeyboardArrowLeft />
          <button className="admin-back-btn">Back</button>
        </div>
        <div className="admin-customer-heading">Customer Details</div>
      </div>

      <div className="admin-customer-info">
        {/* Personal Information */}
        <div className="admin-info-section personal-with-selfie">
          <div className="admin-section-title">Personal Information</div>
          <div className="admin-personal-selfie-wrapper">
            <div className="admin-personal-details">
              {[
                ["Name", customer.name],
                ["Date of Birth", customer.dob],
                ["Gender", customer.gender],
                ["Profession", customer.profession],
                ["Designation", customer.designation]
              ].map(([label, value], i) => (
                <div className="admin-info-row" key={i}>
                  <div className="admin-info-item">
                    <div className="admin-info-item-label">{label}:</div>
                    <div className="admin-info-item-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-selfie-display">
              <img src={sampleimage} alt="Selfie" className="admin-selfie-img" />
            </div>
          </div>
        </div>


        {/* Contact Information */}
        <div className="admin-info-section">
          <div className="admin-section-title">Contact Information</div>
          {[
            ["Email", customer.email],
            ["Mobile", customer.mobile_no],
            ["Permanent Address", customer.address],
            ["Present Address", customer.address]
          ].map(([label, value], i) => (
            <div className="admin-info-row" key={i}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Information */}
        <div className="admin-info-section">
          <div className="admin-section-title">Account Information</div>
          {[
            ["Register Type", customer.register_type],
            // ["Account Status", customer.account_status === 1 ? "Verified" : "Not Verified"],
            [
  "Account Status",
  <span className={customer.account_status === 1 ? "status-text verified" : "status-text not-verified"}>
    {customer.account_status === 1 ? "Verified" : "Not Verified"}
  </span>
],

            ["Created At", customer.created_at]
          ].map(([label, value], i) => (
            <div className="admin-info-row" key={i}>
              <div className="admin-info-item">
                <div className="admin-info-item-label">{label}:</div>
                <div className="admin-info-item-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div className="admin-info-section">
          <div className="admin-section-title">Documents</div>
          <div className="admin-info-row">
            {/* <div className="admin-info-item">
              <div className="admin-info-item-label">Selfie:</div>
              <div className="admin-info-item-value">
                <img src={customer.selfie} alt="Selfie" />
              </div>
            </div> */}
            <div className="admin-info-item">
              <div className="admin-info-item-label">Signature:</div>
              <div className="admin-info-item-value">
                <img src={customer.signature} alt="Signature" className="admin-sign-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerMoreDetails;
