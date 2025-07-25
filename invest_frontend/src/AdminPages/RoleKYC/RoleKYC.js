import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from "../../config";
import {
  MdModeEdit,
  MdDelete,
  MdInsertDriveFile,
  MdVisibility,
} from "react-icons/md";
import { HiMiniXMark } from "react-icons/hi2";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import FilePreviewModal from "../../components/FilePreviewModel/FilePreviewModel";
import { IoCheckmarkOutline } from "react-icons/io5";
import { ImSpinner9 } from "react-icons/im";

const RoleKYCDetails = () => {
  const [kycData, setKycData] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
  const [permissions, setPermissions] = useState({ can_view: false, can_edit: false, can_delete: false });
  const [filePreview, setFilePreview] = useState({ isOpen: false, url: "", type: "" });

  const role_id = sessionStorage.getItem("role_id");

  const fetchKYCData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_id, model_name: "KYCDetails" }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setKycData(data.data || []);
      setPermissions({
        can_view: data.can_view !== false,
        can_edit: data.can_edit,
        can_delete: data.can_delete,
      });
    } catch (error) {
      setPopup({ isOpen: true, message: error.message, type: "error" });
    }
  }, [role_id]);

  useEffect(() => {
    fetchKYCData();
  }, [fetchKYCData]);

  const openPreview = (filePath) => {
    if (filePath) {
      setFilePreview({ isOpen: true, url: `${API_BASE_URL}/${filePath}`, type: "file" });
    }
  };

  const closePreview = () => setFilePreview({ isOpen: false, url: "", type: "" });

  const renderFileStatus = (status, path) => {
    return status === 1 && path ? (
      <MdInsertDriveFile
        className="file-icon"
        onClick={() => openPreview(path)}
        title="View File"
        style={{ cursor: "pointer" }}
      />
    ) : (
      <HiMiniXMark className="not-verified-icon" title="Not Available" />
    );
  };

  const renderStatusIcon = (status, verifyStatus) => {
    return status === 1 && verifyStatus === "completed" ? (
      <span className="status-icon verified"><IoCheckmarkOutline/></span>
    ) : (
      <span className="status-icon not-verified kyc"><ImSpinner9/></span>
    );
  };


  return (
    <div className="role-kyc-details-container">
      <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      <div className="admin-customer-heading">KYC Details</div>

      {!permissions.can_view ? (
        <div className="no-access-msg">🚫 You do not have permission to view this data.</div>
      ) : (
        <>
          <table className="admin-customer-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Customer Name</th>
                <th>PAN Number</th>
                <th>PAN Status</th>
                <th>Aadhar Number</th>
                <th>Aadhar Status</th>
                <th>Bank Account</th>
                <th>IFSC</th>
                <th>Bank Name</th>
                <th>Bank Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {kycData.length === 0 ? (
                <tr>
                  <td colSpan="15" style={{ textAlign: "center" }}>
                    No KYC records found.
                  </td>
                </tr>
              ) : (
                kycData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.customer_name}</td>
                    <td>{item.pan_verify_status === "completed" ? item.pan_number : "-"}</td>
                    <td>{renderStatusIcon(item.pan_status, item.pan_verify_status)}</td>
                    <td>{item.aadhar_verify_status === "completed" ? item.aadhar_number : "-"}</td>
                    <td>{renderStatusIcon(item.aadhar_status, item.aadhar_verify_status)}</td>
                    <td>{item.bank_account_number}</td>
                    <td>{item.bank_ifsc_code}</td>
                    <td>{item.bank_name}</td>
                    <td>{renderStatusIcon(item.bank_status, item.bank_verify_status)}</td>
                    <td>
                      {permissions.can_view && <MdVisibility title="View" className="action-icon view-icon" />}
                      {permissions.can_edit && <MdModeEdit title="Edit" className="action-icon edit-icon" />}
                      {permissions.can_delete && <MdDelete title="Delete" className="action-icon delete-icon" />}
                      {!permissions.can_view && !permissions.can_edit && !permissions.can_delete && <span>–</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>


          </table>

          {filePreview.isOpen && (
            <FilePreviewModal fileUrl={filePreview.url} onClose={closePreview} />
          )}
        </>
      )}
    </div>
  );
};

export default RoleKYCDetails;
