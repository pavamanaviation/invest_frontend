import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { FaSearch } from "react-icons/fa";

const AdminCustomerAllDetails = () => {
    const navigate = useNavigate();
    const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
    const [showSearch, setShowSearch] = useState(false);
    const [isSearchDone, setIsSearchDone] = useState(false);
    return (
        <div className="admin-customer-container">
            <div className="admin-customer-heading">Customer More Details</div>
            <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />
            <div className="admin-search-count-section">
                <div className="admin-search-toggle-container">
                    <button className="admin-toggle-search-btn" >
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
                            />
                        ))}
                        <select
                        >
                            <option value="">Account Status</option>
                            <option value="1">Verified</option>
                            <option value="0">Not Verified</option>
                        </select>
                        <button className="admin-btns admin-search-btn">Search</button>
                        <button className="admin-btns admin-clear-btn" >Clear</button>
                    </div>
                )}

                <div className="admin-customer-count"><strong>Total Customers:</strong> </div>
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
                        <th>Action</th>
                        <th>View More</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>

        </div>
    );
};

export default AdminCustomerAllDetails;
