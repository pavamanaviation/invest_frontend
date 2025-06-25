import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { MdModeEdit, MdDelete, MdArrowForwardIos, MdLocalPhone } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import maleimage from "../../assets/male.png";
import femaleimage from "../../assets/female.png";
import { FiMail } from "react-icons/fi";
import { IoCheckmarkOutline } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";

const AdminNomineeDetails = () => {
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
        navigate(`/admin/nominees/${customerId}`);
    };
    const handleEdit = () => {

    }

    const handleDelete = () => {

    }

    return (
        <div className="admin-customer-container">
            <div className="admin-customer-heading">Nominee Details</div>
            {/* <div className="admin-customer-count"> <strong>Total Customers :</strong> {totalCount}</div> */}
            <table className="admin-customer-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Mobile No</th>
                        <th>Count</th>
                        <th>Nomine Name</th>
                        <th>Relation</th>
                        <th>Gender</th>
                        <th>% Share</th>
                        <th>Action</th>
                        <th>View More</th>

                    </tr>
                </thead>
                <tbody>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                        <MdModeEdit
                            className="admin-edit-icon"
                            onClick={() => handleEdit()}
                        />
                        <MdDelete
                            className="admin-delete-icon"
                            onClick={() => handleDelete()}
                        />

                    </td>
                    <td>
                        <MdArrowForwardIos
                            className="admin-view-more-icon"
                            onClick={() => handleViewMore()}
                        />
                    </td>


                </tbody>
            </table>
        </div>
    );
};

export default AdminNomineeDetails;
