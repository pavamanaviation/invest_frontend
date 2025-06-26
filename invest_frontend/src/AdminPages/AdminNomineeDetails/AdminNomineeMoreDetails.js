import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import { MdKeyboardArrowLeft } from "react-icons/md";
import "../AdminCustomerDetails/AdminCustomerMoreDetails.css";
import "../AdminKYCDetails/AdminKYCDetails.css";

const AdminNomineeMoreDetails = () => {
  const { id } = useParams(); // customer_id
  const navigate = useNavigate();
  const [nominees, setNominees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin-nominee-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "view_more",
            customer_id: id,
            admin_id: sessionStorage.getItem("admin_id"),
          }),
        });

        const data = await response.json();
        if (data.status === "success" && data.nominees?.length > 0) {
          setNominees(data.nominees[0].nominees);
        } else {
          console.error("API error:", data.error);
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNominees();
  }, [id]);

  if (loading) return <div className="customer-loader">Loading...</div>;
  if (nominees.length === 0) return <div className="customer-error">No nominees found</div>;

  return (
    <div className="admin-customer-container admin-customer-more-container">
      <div className="admin-customer-top-div">
        <div className="admin-back-div" onClick={() => navigate(-1)}>
          <MdKeyboardArrowLeft />
          <button className="admin-back-btn">Back</button>
        </div>
        <div className="admin-customer-heading">Nominee Details</div>
      </div>

      {nominees.map((n, index) => (
        <div key={n.nominee_id} className="admin-customer-info">
          <div className="admin-info-section">
            <div className="admin-section-title">Nominee {index + 1}</div>
            <div className="admin-info-row image-right-layout">
              <div className="admin-info-left">
                <div className="admin-info-item">
                  <div className="admin-info-item-label">Name:</div>
                  <div className="admin-info-item-value">{n.first_name} {n.last_name}</div>
                </div>
                <div className="admin-info-item">
                  <div className="admin-info-item-label">Relation:</div>
                  <div className="admin-info-item-value">{n.relation}</div>
                </div>
                <div className="admin-info-item">
                  <div className="admin-info-item-label">DOB:</div>
                  <div className="admin-info-item-value">{n.dob || "-"}</div>
                </div>
                <div className="admin-info-item">
                  <div className="admin-info-item-label">Nominee Status:</div>
                  <div className={`admin-info-item-value status-text ${n.nominee_status === 1 ? "verified" : "not-verified"}`}>
                    {n.nominee_status === 1 ? "Verified" : "Pending"}
                  </div>
                </div>
                <div className="admin-info-item">
                  <div className="admin-info-item-label">Submitted At:</div>
                  <div className="admin-info-item-value">{n.created_at || "-"}</div>
                </div>
              </div>

              <div className="admin-doc-right">
                {n.id_proof_path && (
                  <div className="admin-doc-box">
                    <div className="admin-info-item-label">ID Proof:</div>
                    <img src={n.id_proof_path} alt="ID Proof" className="admin-doc-img" />
                  </div>
                )}
                {n.address_proof_path && (
                  <div className="admin-doc-box">
                    <div className="admin-info-item-label">Address Proof:</div>
                    <img src={n.address_proof_path} alt="Address Proof" className="admin-doc-img" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminNomineeMoreDetails;
