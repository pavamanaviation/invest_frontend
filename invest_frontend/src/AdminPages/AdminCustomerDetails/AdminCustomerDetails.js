import React, { useEffect, useState } from "react";
import "./AdminCustomerDetails.css";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos, MdBoy, MdGirl, MdLocalPhone } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { IoMdMail } from "react-icons/io";
import { SiGmail } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { FaMale, FaFemale } from "react-icons/fa";


const AdminCustomerDetails = () => {
    const [customerData, setCustomerData] = useState([]);
    const navigate = useNavigate();
    const [totalCount, setTotalCount] = useState(0);

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
                }
            } catch (err) {
                console.error("Network error:", err);
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

    return (
        <div className="admin-customer-container">
            <div className="admin-customer-heading">Customer Details</div>
            <div className="admin-customer-count"> <strong>Total Customers :</strong> {totalCount}</div>
            <table className="admin-customer-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>AccountType</th>
                        <th>AccountStatus</th>
                        <th>Created on</th>
                        <th>Action</th>
                        <th>View More</th>

                    </tr>
                </thead>
                <tbody>
                    {customerData.map((customer, index) => (
                        <tr key={customer.customer_id}>
                            <td>{index + 1}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.mobile_no}</td>
                            <td>{customer.dob}</td>
                            <td className="gender-cell">
                                {customer.gender === "Male" ? (
                                    <span className="gender-icon male"><FaMale /> </span>
                                ) : customer.gender === "female" ? (
                                    <span className="gender-icon female"><FaFemale /> </span>
                                ) : (
                                    customer.gender
                                )}
                            </td>
                            <td className="register-type-cell">
                                {customer.register_type === "google" ? (
                                    <span className="register-icon google"><FcGoogle /> </span>
                                ) : customer.register_type === "Email" ? (
                                    <span className="register-icon email"><SiGmail /> </span>
                                ) : customer.register_type === "phone" ? (
                                    <span className="register-icon phone"><MdLocalPhone /> </span>
                                ) : (
                                    customer.register_type
                                )}
                            </td>

                            <td>
                                <span className={`admin-status-badge ${customer.account_status === 1 ? "verified" : "not-verified"}`}>
                                    {customer.account_status === 1 ? (
                                        <span className="status-icon verified">
                                            <TiTick />
                                        </span>
                                    ) : (
                                        <span className="status-icon not-verified">
                                            <ImCross />
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCustomerDetails;
