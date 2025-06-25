import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ImSpinner9 } from "react-icons/im";
import { IoCheckmarkOutline } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";
import { HiMiniXMark } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import PopupMessage from "../../components/PopupMessage/PopupMessage";

const AdminKYCDetails = () => {
  const [kycData, setKycData] = useState([]);
  const navigate = useNavigate();
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    mobile: "",
    pan: "",
    aadhar: "",
    bank_account_number: ""
  });
  const [isSearchDone, setIsSearchDone] = useState(false);
const [filePreview, setFilePreview] = useState(null);


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
          setPopup({
            isOpen: true,
            message: "Something went wrong. Please try again." || data.error,
            type: "error",
          });
        }
      } catch (err) {
        console.error("Network error:", err);
        setPopup({
          isOpen: true,
          message: "Something went wrong. Please try again." || err,
          type: "error",
        });
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

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-customer-kyc-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: sessionStorage.getItem("admin_id"),
          action: "search",
          ...searchParams
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setKycData(data.kyc_list);
        setIsSearchDone(true);
      } else {
        setIsSearchDone(true);

        console.error("Search API error:", data.error);
        setPopup({
          isOpen: true,
          message: "Something went wrong. Please try again." || data.error,
          type: "error",
        });
      }
    } catch (err) {
      setIsSearchDone(true);

      console.error("Network error:", err);
      setPopup({
        isOpen: true,
        message: "Something went wrong. Please try again." || err,
        type: "error",
      });
    }
  };

  const handleClearSearch = async () => {
    setSearchParams({
      name: "",
      mobile: "",
      pan: "",
      aadhar: "",
      bank_account_number: ""
    });

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
      }
    } catch (err) {
      console.error("Error resetting search:", err);
      setPopup({
        isOpen: true,
        message: "Error resetting search." || err,
        type: "error",
      });
    }
  };

  const handleFilePreview = (fileUrl) => {
  setFilePreview(fileUrl);
};

  return (
    <div className="admin-customer-container">
      <PopupMessage
        isOpen={popup.isOpen}
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
      <div className="admin-customer-heading">KYC Details</div>

      <div className="admin-search-toggle-container">
        <button className="admin-toggle-search-btn kyc" onClick={() => setShowSearch(!showSearch)}>
          <FaSearch /> Search Filters
        </button>
      </div>

      {showSearch && (
        <div className="admin-search-section">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by Mobile"
            value={searchParams.mobile}
            onChange={(e) => setSearchParams({ ...searchParams, mobile: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by PAN"
            value={searchParams.pan}
            onChange={(e) => setSearchParams({ ...searchParams, pan: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by Aadhar"
            value={searchParams.aadhar}
            onChange={(e) => setSearchParams({ ...searchParams, aadhar: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by Bank A/C"
            value={searchParams.bank_account_number}
            onChange={(e) => setSearchParams({ ...searchParams, bank_account_number: e.target.value })}
          />
          <button className="admin-btns admin-search-btn" onClick={handleSearch}>Search</button>
          <button className="admin-btns admin-clear-btn" onClick={handleClearSearch}>Clear</button>
        </div>
      )}

      <table className="admin-customer-table">
        {filePreview && (
  <div className="file-popup-overlay" onClick={() => setFilePreview(null)}>
    <div className="file-popup-content" onClick={(e) => e.stopPropagation()}>
      <span className="file-close-btn" onClick={() => setFilePreview(null)}>&times;</span>
      <iframe src={filePreview} title="File Preview" className="file-iframe" />
    </div>
  </div>
)}

        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>PAN</th>
            <th>PAN Status</th>
            <th>PAN Image</th>
            <th>Aadhar</th>
            <th>Aadhar Status</th>
            <th>Aadhar Image</th>
            <th>Bank A/C no</th>
            <th>Bank Status</th>
            <th>Action</th>
            <th>View More</th>
          </tr>
        </thead>
        <tbody>
          {isSearchDone && kycData.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", padding: "20px", fontWeight: "500" }}>
                🔍 No search results found.
              </td>
            </tr>
          ) : (
            kycData.map((kyc, index) => (
              <tr key={kyc.customer_id}>
                <td>{index + 1}</td>
                <td>{kyc.customer_fname} {kyc.customer_lname}</td>
                <td>{kyc.mobile}</td>
                <td>{kyc.pan_number || "-"}</td>
                <td>
                  <span className={`admin-status-badge ${kyc.pan_status === 1 ? "verified" : "not-verified"}`}>
                    {kyc.pan_status === 1 ? (
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
                  <span className={`admin-status-badge ${kyc.pan_status === 1 ? "verified" : "not-verified"}`}>
                    {kyc.pan_status === 1 ? (
                      <span className="status-icon verified kyc"    onClick={() => handleFilePreview(kyc.pan_path)}>

                        <FaRegFileAlt />
                      </span>
                    ) : (
                      <span className="status-icon not-verified">
                        <HiMiniXMark />
                      </span>
                    )}
                  </span>
                </td>
                <td>{kyc.aadhar_number || "-"}</td>
                <td>
                  <span className={`admin-status-badge ${kyc.aadhar_status === 1 ? "verified" : "not-verified"}`}>
                    {kyc.aadhar_status === 1 ? (
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
                  <span className={`admin-status-badge ${kyc.aadhar_status === 1 ? "verified" : "not-verified"}`}>
                    {kyc.aadhar_status === 1 ? (
                      <span className="status-icon verified kyc"  onClick={() => handleFilePreview(kyc.aadhar_path)}>
                        <FaRegFileAlt />
                      </span>
                    ) : (
                      <span className="status-icon not-verified">
                        <HiMiniXMark />
                      </span>
                    )}
                  </span>
                </td>
                <td>{kyc.bank_account_number || "-"}</td>
                <td>
                  <span className={`admin-status-badge ${kyc.bank_status === 1 ? "verified" : "not-verified"}`}>
                    {kyc.bank_status === 1 ? (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminKYCDetails;
