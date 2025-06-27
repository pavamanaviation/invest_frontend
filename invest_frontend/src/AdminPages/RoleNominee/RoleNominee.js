import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { AiOutlineFilePdf } from "react-icons/ai";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import FilePreviewPopup from "../../components/FilePreviewModel/FilePreviewModel"; // Assuming this exists

const RoleNomineeDetails = () => {
  const [nominees, setNominees] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
  const [permissions, setPermissions] = useState({ can_view: false, can_edit: false, can_delete: false });
  const [previewFile, setPreviewFile] = useState(null);

  const role_id = sessionStorage.getItem("role_id");

  useEffect(() => {
    const fetchNomineeDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role_id, model_name: "NomineeDetails" }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setNominees(data.data || []);
        setPermissions({
          can_view: data.can_view,
          can_edit: data.can_edit,
          can_delete: data.can_delete,
        });
      } catch (error) {
        setPopup({ isOpen: true, message: error.message, type: "error" });
      }
    };

    fetchNomineeDetails();
  }, [role_id]);

  const handleEdit = (id) => permissions.can_edit && console.log("Edit nominee ID:", id);
  const handleDelete = (id) => permissions.can_delete && console.log("Delete nominee ID:", id);
  const handleView = (id) => permissions.can_view && console.log("View nominee ID:", id);

  const renderFileIcon = (filePath, verified) => {
    if (verified && filePath && filePath.endsWith(".pdf" || ".png" || ".jpg")) {
      return <AiOutlineFilePdf className="file-icon" onClick={() => setPreviewFile(filePath)} />;
    } else {
      return <HiMiniXMark className="not-verified-icon" />;
    }
  };

  return (
    <div className="role-nominee-container">
      <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      <h2 className="page-title">Nominee Details</h2>

      {!permissions.can_view ? (
        <div className="no-access-msg">🚫 You do not have permission to view nominee data.</div>
      ) : (
        <table className="admin-customer-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Relation</th>
              <th>DOB</th>
              <th>Share %</th>
              <th>Address Proof</th>
              <th>ID Proof</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {nominees.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>No nominee data found.</td>
              </tr>
            ) : (
              nominees.map((nominee, idx) => (
                <tr key={nominee.id}>
                  <td>{idx + 1}</td>
                  <td>{`${nominee.first_name} ${nominee.last_name}`}</td>
                  <td>{nominee.relation}</td>
                  <td>{nominee.dob}</td>
                  <td>{nominee.share}%</td>
                  <td>{renderFileIcon(nominee.address_proof_path, nominee.nominee_status)}</td>
                  <td>{renderFileIcon(nominee.id_proof_path, nominee.nominee_status)}</td>
                  <td>
                    {nominee.nominee_status === 1 ? (
                      <span className="admin-status-badge verified"><IoCheckmarkOutline /></span>
                    ) : (
                      <span className="admin-status-badge not-verified"><HiMiniXMark /></span>
                    )}
                  </td>
                  <td>{nominee.created_at?.split("T")[0]}</td>
                  <td>
                    {permissions.can_view && <MdRemoveRedEye onClick={() => handleView(nominee.id)} className="action-icon view" />}
                    {permissions.can_edit && <MdModeEdit onClick={() => handleEdit(nominee.id)} className="action-icon edit" />}
                    {permissions.can_delete && <MdDelete onClick={() => handleDelete(nominee.id)} className="action-icon delete" />}
                    {!permissions.can_edit && !permissions.can_delete && !permissions.can_view && <span>–</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {previewFile && (
        <FilePreviewPopup
          filePath={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default RoleNomineeDetails;
