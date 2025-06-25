import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminKYCDetails = () => {
  const [kycData, setKycData] = useState([]);
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
            admin_id: sessionStorage.getItem("admin_id"),
            action: "view",
          }),
        });

        const data = await response.json();
        if (data.status === "success") {
          setKycData(data.kyc_list);
        } else {
          console.error("API error:", data.error);
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchKYCDetails();
  }, []);

  const handleViewMore = (customerId) => {
    navigate(`/admin/kyc/${customerId}`);
  };

  const handleEdit = (id) => {
    console.log("Edit clicked for:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete clicked for:", id);
  };

  const renderStatusBadge = (status) => (
    <span className={`admin-status-badge ${status === 1 ? "verified" : status === 2 ? "rejected" : "pending"}`}>
      {status === 1 ? "Verified" : status === 2 ? "Rejected" : "Pending"}
    </span>
  );

  return (
    <div className="admin-customer-container">
      <div className="admin-customer-heading">KYC Details</div>
      <table className="admin-customer-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Email</th>
            <th>PAN</th>
            <th>PAN Status</th>
            <th>Aadhar</th>
            <th>Aadhar Status</th>
            <th>Bank A/C no</th>
            <th>Bank Status</th>
            <th>Action</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {kycData.map((kyc, index) => (
            <tr key={kyc.customer_id}>
              <td>{index + 1}</td>
              <td>{kyc.email}</td>
              <td>{kyc.pan_number || "-"}</td>
              <td>{renderStatusBadge(kyc.pan_status)}</td>
              <td>{kyc.aadhar_number || "-"}</td>
              <td>{renderStatusBadge(kyc.aadhar_status)}</td>
              <td>{kyc.bank_account_number || "-"}</td>
              <td>{renderStatusBadge(kyc.bank_status)}</td>
              <td>
                <MdModeEdit
                  className="admin-edit-icon"
                  onClick={() => handleEdit(kyc.customer_id)}
                />
                <MdDelete
                  className="admin-delete-icon"
                  onClick={() => handleDelete(kyc.customer_id)}
                />
              </td>
              <td>
                <MdArrowForwardIos
                  className="admin-view-more-icon"
                  onClick={() => handleViewMore(kyc.customer_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminKYCDetails;
