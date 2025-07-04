import React, { useEffect, useState, useCallback } from "react";
import "./AdminCustomerDetails.css";
import API_BASE_URL from "../../config";
import { useNavigate } from "react-router-dom";
import {
  MdModeEdit,
  MdDelete,
  MdArrowForwardIos,
  MdLocalPhone,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FiMail } from "react-icons/fi";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import maleimage from "../../assets/male.png";
import femaleimage from "../../assets/female.png";

const LIMIT = 10;

const AdminCustomerDetails = () => {
  const [customerData, setCustomerData] = useState([]);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearchDone, setIsSearchDone] = useState(false);

  const [searchParams, setSearchParams] = useState({
    name: "",
    email: "",
    mobile_no: "",
    account_status: "",
  });

  const navigate = useNavigate();
  const admin_id = sessionStorage.getItem("admin_id");

  const fetchCustomers = useCallback(
    async (action = "view", extraParams = {}) => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin-customer-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            admin_id,
            action,
            limit: LIMIT,
            offset,
            ...extraParams,
          }),
        });

        const data = await response.json();
        if (data.status === "success") {
          setCustomerData(data.customers);
          setTotalCount(data.total_count);
        } else {
          throw new Error(data.error || "Failed to fetch customer data");
        }
      } catch (error) {
        setPopup({
          isOpen: true,
          message: error.message || "Something went wrong.",
          type: "error",
        });
      }
    },
    [admin_id, offset]
  );

  useEffect(() => {
    fetchCustomers("view");
  }, [fetchCustomers]);

  const handleViewMore = (id) => navigate(`/admin/customers/${id}`);
  const handleEdit = () => { };
  const handleDelete = () => { };

  const handleSearch = () => {
    setIsSearchDone(true);
    setOffset(0);
    fetchCustomers("search", searchParams);
  };

  const handleClearSearch = () => {
    setSearchParams({ name: "", email: "", mobile_no: "", account_status: "" });
    setIsSearchDone(false);
    setOffset(0);
    fetchCustomers("view");
  };

  const handlePageChange = (direction) => {
    const newOffset = direction === "next" ? offset + LIMIT : Math.max(0, offset - LIMIT);
    setOffset(newOffset);
  };

  const renderPagination = () => {
    const isNextDisabled = offset + LIMIT >= totalCount;
    const isPrevDisabled = offset === 0;

    return (
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={isPrevDisabled}
          onClick={() => handlePageChange("prev")}
        >
          ⬅ Prev
        </button>
        <span className="pagination-page-info">
          Page {Math.floor(offset / LIMIT) + 1} of {Math.ceil(totalCount / LIMIT)}
        </span>
        <button
          className="pagination-btn"
          disabled={isNextDisabled}
          onClick={() => handlePageChange("next")}
        >
          Next ➡
        </button>
      </div>

    );
  };

  return (
    <div className="admin-customer-container">
      <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
      <div className="admin-customer-heading">Customer Register Details</div>

      <div className="admin-search-count-section">
        <div className="admin-search-toggle-container">
          <button className="admin-toggle-search-btn" onClick={() => setShowSearch(!showSearch)}>
            <FaSearch /> Search Filters
          </button>
        </div>

        {showSearch && (
          <div className="admin-search-section">
            {["name", "email", "mobile_no"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={`Search by ${field.replace("_", " ")}`}
                value={searchParams[field]}
                onChange={(e) => setSearchParams({ ...searchParams, [field]: e.target.value })}
              />
            ))}
            <select
              value={searchParams.account_status}
              onChange={(e) => setSearchParams({ ...searchParams, account_status: e.target.value })}
            >
              <option value="">Account Status</option>
              <option value="1">Verified</option>
              <option value="0">Not Verified</option>
            </select>
            <button className="admin-btns admin-search-btn" onClick={handleSearch}>Search</button>
            <button className="admin-btns admin-clear-btn" onClick={handleClearSearch}>Clear</button>
          </div>
        )}

        <div className="admin-customer-count"><strong>Total Customers:</strong> {totalCount}</div>
      </div>

      <table className="admin-customer-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>RegisterType</th>
            <th>RegisterStatus</th>

            <th>AccountStatus</th>
            <th>Created on</th>
            <th>Action</th>
            <th>View More</th>
          </tr>
        </thead>
        <tbody>
          {isSearchDone && customerData.length === 0 ? (
            <tr>
              <td colSpan="11" style={{ textAlign: "center", padding: "20px", fontWeight: "500" }}>
                🔍 No search results found.
              </td>
            </tr>
          ) : (
            customerData.map((customer, index) => (
              <tr key={customer.customer_id}>
                <td>{offset + index + 1}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.mobile_no}</td>
                <td>{customer.dob}</td>
                <td className="gender-avatar-cell">
                  <img
                    src={customer.gender.toLowerCase() === "female" ? femaleimage : maleimage}
                    alt="Gender"
                    className="gender-avatar-img"
                  />
                </td>
                <td className="register-type-cell">
                  {customer.register_type === "google" ? <span className="register-icon google"><FcGoogle /></span> :
                    customer.register_type === "Email" ? <span className="register-icon email"><FiMail /></span> :
                      customer.register_type === "Mobile" ? <span className="register-icon phone"><MdLocalPhone /></span> :
                        customer.register_type}
                </td>
                <td>
                  <span className={`admin-status-badge ${customer.register_status === 1 ? "verified" : "not-verified"}`}>
                    {customer.register_status === 1 ? <span className="status-icon verified">
                      <IoCheckmarkOutline />
                    </span> : <span className="status-icon not-verified">
                      <HiMiniXMark />
                    </span>}
                  </span>
                </td>
                <td>
                  <span className={`admin-status-badge ${customer.account_status === 1 ? "verified" : "not-verified"}`}>
                    {customer.account_status === 1 ? <span className="status-icon verified">
                      <IoCheckmarkOutline />
                    </span> : <span className="status-icon not-verified">
                      <HiMiniXMark />
                    </span>}
                  </span>
                </td>
                <td>{customer.created_at}</td>
                <td>
                  <MdModeEdit onClick={() => handleEdit(customer.customer_id)} className="admin-edit-icon" />
                  <MdDelete onClick={() => handleDelete(customer.customer_id)} className="admin-delete-icon" />
                </td>
                <td>
                  <MdArrowForwardIos onClick={() => handleViewMore(customer.customer_id)} className="admin-view-more-icon" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {renderPagination()}
    </div>
  );
};

export default AdminCustomerDetails;
