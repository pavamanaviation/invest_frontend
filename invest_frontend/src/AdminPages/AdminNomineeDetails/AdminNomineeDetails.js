import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos } from "react-icons/md";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { ImSpinner9 } from "react-icons/im";
import { FaRegFileAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const LIMIT = 10;

const AdminNomineeDetails = () => {
  const [nominees, setNominees] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
  const [filePreview, setFilePreview] = useState(null);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({ name: "", mobile_no: "" });
  const [isSearchDone, setIsSearchDone] = useState(false);
  const navigate = useNavigate();

  const fetchNomineeData = useCallback(async (action = "view") => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-nominee-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: sessionStorage.getItem("admin_id"),
          action,
          limit: LIMIT,
          offset,
          ...searchParams,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setNominees(data.nominees || []);
        setTotalCount(data.total_count || 0);
      } else {
        throw new Error(data.error || "Failed to fetch");
      }
    } catch (err) {
      setPopup({ isOpen: true, message: err.message, type: "error" });
    }
  }, [offset, searchParams]);

  useEffect(() => {
    fetchNomineeData(isSearchDone ? "search" : "view");
  }, [fetchNomineeData]);

  const handleViewMore = (customerId) => navigate(`/admin/nominees/${customerId}`);
  const handlePageChange = (dir) => setOffset(prev => Math.max(0, dir === "next" ? prev + LIMIT : prev - LIMIT));
  const handleFilePreview = (fileUrl) => setFilePreview(fileUrl);
  const handleSearch = () => { setOffset(0); setIsSearchDone(true); fetchNomineeData("search"); };
  const handleClear = () => { setOffset(0); setSearchParams({ name: "", mobile_no: "" }); setIsSearchDone(false); fetchNomineeData("view"); };

  return (
    <div className="admin-customer-container">
      <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      <div className="admin-customer-heading">Nominee Details</div>
      <div className="admin-search-count-section">

      <div className="admin-search-toggle-container">
        <button className="admin-toggle-search-btn kyc" onClick={() => setShowSearch(!showSearch)}>
          <FaSearch /> Search Filters
        </button>
      </div>

      {showSearch && (
        <div className="admin-search-section">
          <input placeholder="Search by Name" value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })} />
          <input placeholder="Search by Mobile" value={searchParams.mobile_no}
            onChange={(e) => setSearchParams({ ...searchParams, mobile_no: e.target.value })} />
          <button className="admin-btns admin-search-btn" onClick={handleSearch}>Search</button>
          <button className="admin-btns admin-clear-btn" onClick={handleClear}>Clear</button>
        </div>
      )}
              <div className="admin-customer-count"><strong>Total Nominees:</strong> {totalCount}</div>

      </div>


      <table className="admin-customer-table">
        <thead>
          <tr>
            <th>S.No</th><th>Name</th><th>Mobile</th><th>Nominee Name</th><th>Relation</th>
            <th>DOB</th><th>ID Proof</th><th>Address Proof</th><th>Action</th><th>View More</th>
          </tr>
        </thead>
        <tbody>
          {isSearchDone && nominees.length === 0 ? (
            <tr><td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>🔍 No nominees found.</td></tr>
          ) : (
            nominees.map((c, i) => {
              const n = c.nominees[0];
              return (
                <tr key={n.nominee_id}>
                  <td>{offset + i + 1}</td>
                  <td>{c.customer_name}</td>
                  <td>{c.customer_mobile}</td>
                  <td>{n.first_name} {n.last_name}</td>
                  <td>{n.relation}</td>
                  <td>{n.dob}</td>
                  <td>
                    {n.id_proof_path ? (
                      <span className="status-icon verified kyc" onClick={() => handleFilePreview(n.id_proof_path)}>
                        <FaRegFileAlt />
                      </span>
                    ) : <HiMiniXMark />}
                  </td>
                  <td>
                    {n.address_proof_path ? (
                      <span className="status-icon verified kyc" onClick={() => handleFilePreview(n.address_proof_path)}>
                        <FaRegFileAlt />
                      </span>
                    ) : <HiMiniXMark />}
                  </td>
                  <td>
                    <MdModeEdit className="admin-edit-icon" />
                    <MdDelete className="admin-delete-icon" />
                  </td>
                  <td>
                    <MdArrowForwardIos className="admin-view-more-icon" onClick={() => handleViewMore(c.customer_id)} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {filePreview && (
        <div className="file-popup-overlay" onClick={() => setFilePreview(null)}>
          <div className="file-popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="file-close-btn" onClick={() => setFilePreview(null)}>&times;</span>
            <iframe src={filePreview} title="File Preview" className="file-iframe" />
          </div>
        </div>
      )}
      <div className="pagination-controls">
        <button disabled={offset === 0} onClick={() => handlePageChange("prev")} className="pagination-btn">⬅ Prev</button>
        <span className="pagination-page-info">
          Page {Math.floor(offset / LIMIT) + 1} of {Math.ceil(totalCount / LIMIT)}
        </span>
        <button disabled={offset + LIMIT >= totalCount} onClick={() => handlePageChange("next")} className="pagination-btn">Next ➡</button>
      </div>
    </div>
  );
};

export default AdminNomineeDetails;
