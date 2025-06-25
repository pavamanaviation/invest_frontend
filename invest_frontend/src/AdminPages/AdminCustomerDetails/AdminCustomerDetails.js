import React, { useEffect, useState } from "react";
import "./AdminCustomerDetails.css";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos, MdLocalPhone } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import maleimage from "../../assets/male.png";
import femaleimage from "../../assets/female.png";
import { FiMail } from "react-icons/fi";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { FaSearch } from "react-icons/fa";

const AdminCustomerDetails = () => {
    const [customerData, setCustomerData] = useState([]);
    const navigate = useNavigate();
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    const [totalCount, setTotalCount] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [searchParams, setSearchParams] = useState({
        name: "",
        email: "",
        mobile_no: "",
        account_status: ""
    });
    const [isSearchDone, setIsSearchDone] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/admin-customer-details`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        admin_id: sessionStorage.getItem("admin_id"),
                        "action": "view",
                    }),
                });

                const data = await response.json();
                if (data.status === "success") {
                    setCustomerData(data.customers);
                    setTotalCount(data.total_count);
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

        fetchCustomers();
    }, []);


    const handleViewMore = (customerId) => {
        navigate(`/admin/customers/${customerId}`);
    };
    const handleEdit = () => {

    }

    const handleDelete = () => {

    }
    const handleSearch = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin-customer-details`, {
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
                setCustomerData(data.customers);
                setTotalCount(data.total_count);
                setIsSearchDone(true); // ✅ mark that search was performed
            } else {
                setIsSearchDone(true);
                setPopup({ isOpen: true, message: data.error || "Something went wrong.", type: "error" });
            }
        } catch (err) {
            setIsSearchDone(true);
            setPopup({ isOpen: true, message: "Something went wrong.", type: "error" });
        }
    };
    const handleClearSearch = async () => {
        setSearchParams({
            name: "",
            email: "",
            mobile_no: "",
            account_status: ""
        });

        setIsSearchDone(false); // ✅ reset the search flag

        try {
            const response = await fetch(`${API_BASE_URL}/admin-customer-details`, {
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
                setCustomerData(data.customers);
                setTotalCount(data.total_count);
            } else {
                setPopup({ isOpen: true, message: "Failed to reset search.", type: "error" });
            }
        } catch (err) {
            setPopup({ isOpen: true, message: "Something went wrong.", type: "error" });
        }
    };

    return (
        <div className="admin-customer-container">
            <PopupMessage
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />

            <div className="admin-customer-heading">Customer Details</div>
            <div className="admin-search-count-section">

                <div className="search-toggle-container">
                    <button className="admin-toggle-search-btn" onClick={() => setShowSearch(!showSearch)}>
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
                            placeholder="Search by Email"
                            value={searchParams.email}
                            onChange={(e) => setSearchParams({ ...searchParams, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Search by Mobile No"
                            value={searchParams.mobile_no}
                            onChange={(e) => setSearchParams({ ...searchParams, mobile_no: e.target.value })}
                        />
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
                <div className="admin-customer-count"> <strong>Total Customers :</strong> {totalCount}</div>
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
                                <td>{index + 1}</td>
                                <td>{customer.name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.mobile_no}</td>
                                <td>{customer.dob}</td>
                                <td className="gender-avatar-cell">
                                    <img
                                        src={
                                            customer.gender.toLowerCase() === "male"
                                                ? maleimage
                                                : customer.gender.toLowerCase() === "female"
                                                    ? femaleimage
                                                    : maleimage
                                        }
                                        alt="Gender"
                                        className="gender-avatar-img"
                                    />
                                </td>
                                <td className="register-type-cell">
                                    {customer.register_type === "google" ? (
                                        <span className="register-icon google"><FcGoogle /></span>
                                    ) : customer.register_type === "Email" ? (
                                        <span className="register-icon email"><FiMail /></span>
                                    ) : customer.register_type === "phone" ? (
                                        <span className="register-icon phone"><MdLocalPhone /></span>
                                    ) : (
                                        customer.register_type
                                    )}
                                </td>
                                <td>
                                    <span className={`admin-status-badge ${customer.account_status === 1 ? "verified" : "not-verified"}`}>
                                        {customer.account_status === 1 ? (
                                            <span className="status-icon verified">
                                                <IoCheckmarkOutline />
                                            </span>
                                        ) : (
                                            <span className="status-icon not-verified">
                                                <HiMiniXMark />
                                            </span>
                                        )}
                                    </span>
                                </td>
                                <td>{customer.created_at}</td>
                                <td>
                                    <MdModeEdit
                                        className="admin-edit-icon"
                                        onClick={() => handleEdit(customer.customer_id)}
                                    />
                                    <MdDelete
                                        className="admin-delete-icon"
                                        onClick={() => handleDelete(customer.customer_id)}
                                    />
                                </td>
                                <td>
                                    <MdArrowForwardIos
                                        className="admin-view-more-icon"
                                        onClick={() => handleViewMore(customer.customer_id)}
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

export default AdminCustomerDetails;
