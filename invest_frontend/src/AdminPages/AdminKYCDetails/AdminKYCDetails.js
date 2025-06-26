import React, { useEffect, useState, useCallback } from "react";
import API_BASE_URL from "../../config";
import {
  MdModeEdit, MdDelete, MdArrowForwardIos
} from "react-icons/md";
import { ImSpinner9 } from "react-icons/im";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaRegFileAlt, FaSearch } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import "./AdminKYCDetails.css";

const LIMIT = 10;

const AdminKYCDetails = () => {
  const [kycData, setKycData] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchDone, setIsSearchDone] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    name: "", mobile: "", pan: "", aadhar: "", bank_account_number: ""
  });

  const fetchKYCDetails = useCallback(async (action = "view") => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-customer-kyc-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: sessionStorage.getItem("admin_id"),
          action,
          limit: LIMIT,
          offset,
          ...searchParams
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setKycData(data.kyc_list);
        setTotalCount(data.total_count);
      } else {
        throw new Error(data.error || "Failed to fetch");
      }
    } catch (err) {
      setPopup({ isOpen: true, message: err.message || "Error fetching data", type: "error" });
    }
  }, [offset, searchParams]);

  useEffect(() => {
    fetchKYCDetails(isSearchDone ? "search" : "view");
  }, [fetchKYCDetails]);

  const handlePageChange = (direction) => {
    const newOffset = direction === "next" ? offset + LIMIT : Math.max(0, offset - LIMIT);
    setOffset(newOffset);
  };

  const handleSearch = () => {
    setOffset(0);
    setIsSearchDone(true);
    fetchKYCDetails("search");
  };

  const handleClearSearch = () => {
    setOffset(0);
    setSearchParams({ name: "", mobile: "", pan: "", aadhar: "", bank_account_number: "" });
    setIsSearchDone(false);
    fetchKYCDetails("view");
  };

  const renderPagination = () => {
    const currentPage = Math.floor(offset / LIMIT) + 1;
    const totalPages = Math.ceil(totalCount / LIMIT);
    return (
      <div className="pagination-controls">
        <button disabled={offset === 0} onClick={() => handlePageChange("prev")} className="pagination-btn">⬅ Prev</button>
        <span className="pagination-page-info">Page {currentPage} of {totalPages}</span>
        <button disabled={offset + LIMIT >= totalCount} onClick={() => handlePageChange("next")} className="pagination-btn">Next ➡</button>
      </div>
    );
  };

  const handleFilePreview = (fileUrl) => setFilePreview(fileUrl);

  return (
    <div className="admin-customer-container">
      <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      <div className="admin-customer-heading">KYC Details</div>
      <div className="admin-search-count-section">

      <div className="admin-search-toggle-container">
        <button className="admin-toggle-search-btn kyc" onClick={() => setShowSearch(!showSearch)}>
          <FaSearch /> Search Filters
        </button>
      </div>

      {showSearch && (
        <div className="admin-search-section">
          {["name", "mobile", "pan", "aadhar", "bank_account_number"].map(field => (
            <input key={field} placeholder={`Search by ${field.replace("_", " ")}`}
              value={searchParams[field]} onChange={(e) =>
                setSearchParams({ ...searchParams, [field]: e.target.value })}
            />
          ))}
          <button className="admin-btns admin-search-btn" onClick={handleSearch}>Search</button>
          <button className="admin-btns admin-clear-btn" onClick={handleClearSearch}>Clear</button>
        </div>
      )}
      </div>

      {filePreview && (
        <div className="file-popup-overlay" onClick={() => setFilePreview(null)}>
          <div className="file-popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="file-close-btn" onClick={() => setFilePreview(null)}>&times;</span>
            <iframe src={filePreview} title="File Preview" className="file-iframe" />
          </div>
        </div>
      )}

      <table className="admin-customer-table">
        <thead>
          <tr>
            <th>S.No</th><th>Name</th><th>Mobile</th><th>PAN</th><th>PAN Status</th><th>PAN File</th>
            <th>Aadhar</th><th>Aadhar Status</th><th>Aadhar File</th>
            <th>Bank A/C</th><th>Bank Status</th><th>Action</th><th>View</th>
          </tr>
        </thead>
        <tbody>
          {isSearchDone && kycData.length === 0 ? (
            <tr><td colSpan="13" style={{ textAlign: "center", padding: "20px" }}>🔍 No results found.</td></tr>
          ) : kycData.map((k, i) => (
            <tr key={k.customer_id}>
              <td>{offset + i + 1}</td>
              <td>{k.customer_fname} {k.customer_lname}</td>
              <td>{k.mobile}</td>
              <td>{k.pan_number || "-"}</td>
               <td>
                  <span className={`admin-status-badge ${k.pan_status === 1 ? "verified" : "not-verified"}`}>
                    {k.pan_status === 1 ? (
                      <span className="status-icon verified">
                        <IoCheckmarkOutline />
                      </span>
                    ) : (
                      <span className="status-icon not-verified">
                        <ImSpinner9 />
                      </span>
                    )}
                  </span>
                </td>
                 <td>
                  <span className={`admin-status-badge ${k.pan_status === 1 ? "verified" : "not-verified"}`}>
                    {k.pan_status === 1 ? (
                      <span className="status-icon verified kyc"    onClick={() => handleFilePreview(k.pan_path)}>

                        <FaRegFileAlt />
                      </span>
                    ) : (
                      <span className="status-icon not-verified">
                        <HiMiniXMark />
                      </span>
                    )}
                  </span>
                </td>
              <td>{k.aadhar_number || "-"}</td>
            <td>
                  <span className={`admin-status-badge ${k.aadhar_status === 1 ? "verified" : "not-verified"}`}>
                    {k.aadhar_status === 1 ? (
                      <span className="status-icon verified">
                        <IoCheckmarkOutline />
                      </span>
                    ) : (
                      <span className="status-icon not-verified kyc">
                        <ImSpinner9 />
                      </span>
                    )}
                  </span>
                </td>
              <td>
                  <span className={`admin-status-badge ${k.aadhar_status === 1 ? "verified" : "not-verified"}`}>
                    {k.aadhar_status === 1 ? (
                      <span className="status-icon verified kyc"  onClick={() => handleFilePreview(k.aadhar_path)}>
                        <FaRegFileAlt />
                      </span>
                    ) : (
                      <span className="status-icon not-verified">
                        <HiMiniXMark />
                      </span>
                    )}
                  </span>
                </td>
              <td>{k.bank_account_number || "-"}</td>
                    <td>
                  <span className={`admin-status-badge ${k.bank_status === 1 ? "verified" : "not-verified"}`}>
                    {k.bank_status === 1 ? (
                       <span className="status-icon verified">
                        <IoCheckmarkOutline />
                      </span>
                    ) : (
                      <span className="status-icon not-verified kyc">
                        <ImSpinner9 />
                      </span>
                    )}
                  </span>
                </td>
                <td>
                 <MdModeEdit className="admin-edit-icon" />
                <MdDelete className="admin-delete-icon" />
                </td>
              <td><MdArrowForwardIos onClick={() => navigate(`/admin/kyc/${k.customer_id}`)} className="admin-view-more-icon" /></td>
            </tr>
          ))}
        </tbody>
      </table>

      {renderPagination()}
    </div>
  );
};

export default AdminKYCDetails;
