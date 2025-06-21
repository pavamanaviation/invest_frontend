// import React, { useEffect, useState } from 'react';
// import { RiDeleteBin5Fill } from 'react-icons/ri';
// import { FaRegEdit } from 'react-icons/fa';
// import './AdminViewRole.css';
// import { useNavigate } from 'react-router-dom';
// import PopupMessage from '../../components/PopupMessage/PopupMessage';

// const ViewRole = () => {
//   const [roles, setRoles] = useState([]);
//   const [popup, setPopup] = useState({
//     show: false,
//     message: '',
//     type: 'info'
//   });

//   const navigate = useNavigate();
//   const adminId = sessionStorage.getItem('admin_id') || 1;

//   const fetchRoles = async () => {
//     try {
//       const res = await fetch('http://127.0.0.1:8080/view-roles', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ admin_id: adminId })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setRoles(data.roles);
//       }
//     } catch (err) {
//       console.error('Error fetching roles:', err);
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const handleDelete = async (role_id) => {
//     if (!window.confirm('Are you sure you want to disable this role?')) return;
//     try {
//       const res = await fetch('http://127.0.0.1:8080/delete-role', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ role_id })
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setPopup({
//           show: true,
//           message: data.message || 'Role disabled successfully.',
//           type: 'success'
//         });
//         fetchRoles();
//       } else {
//         setPopup({
//           show: true,
//           message: data.error || 'Error disabling role.',
//           type: 'error'
//         });
//       }
//     } catch (err) {
//       setPopup({
//         show: true,
//         message: 'Failed to disable role. Try again later.',
//         type: 'error'
//       });
//     }
//   };

//   const handleEditClick = (role_id) => {
//     sessionStorage.setItem('edit_role_id', role_id);
//     navigate('/edit-team');
//   };

//   return (
//     <div className="admin-view-role-container">
//       <h2>Role List</h2>

//       {popup.show && (
//         <PopupMessage
//           isOpen={popup.show}
//           message={popup.message}
//           type={popup.type}
//           onClose={() => setPopup({ ...popup, show: false })}
//         />
//       )}

//       <table className="admin-roles-table">
//         <thead>
//           <tr>
//             <th>S.No</th>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Mobile</th>
//             <th>Company</th>
//             <th>Role</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {roles.map((role, index) => (
//             <tr key={role.id}>
//               <td>{index + 1}</td>
//               <td>{role.first_name} {role.last_name}</td>
//               <td>{role.email}</td>
//               <td>{role.mobile_no}</td>
//               <td>{role.company_name}</td>
//               <td>{role.role_type}</td>
//               <td>
//                 <FaRegEdit
//                   className="admin-edit-icon"
//                   onClick={() => handleEditClick(role.id)}
//                 />
//                 {role.status === 1 ? (
//                   <RiDeleteBin5Fill
//                     className="admin-delete-icon"
//                     onClick={() => handleDelete(role.id)}
//                   />
//                 ) : (
//                   <span className="admin-disabled-delete">-</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewRole;

import React, { useEffect, useState } from 'react';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { FaRegEdit } from 'react-icons/fa';
import './AdminViewRole.css';
import { useNavigate } from 'react-router-dom';
import PopupMessage from '../../components/PopupMessage/PopupMessage';

const ViewRole = () => {
  const [roles, setRoles] = useState([]);
  const [popup, setPopup] = useState({
    show: false,
    message: '',
    type: 'info'
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    roleId: null
  });

  const navigate = useNavigate();
  const adminId = sessionStorage.getItem('admin_id') || 1;

  const fetchRoles = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8080/view-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ admin_id: adminId })
      });
      const data = await res.json();
      if (res.ok) {
        setRoles(data.roles);
      }
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEditClick = (role_id) => {
    sessionStorage.setItem('edit_role_id', role_id);
    navigate('/edit-team');
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8080/delete-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role_id: confirmDelete.roleId })
      });
      const data = await res.json();
      if (res.ok) {
        setPopup({
          show: true,
          message: data.message || 'Role deleted successfully.',
          type: 'success'
        });
        setConfirmDelete({ show: false, roleId: null });
        fetchRoles();
      } else {
        setPopup({
          show: true,
          message: data.error || 'Error disabling role.',
          type: 'error'
        });
        setConfirmDelete({ show: false, roleId: null });
      }
    } catch (err) {
      setPopup({
        show: true,
        message: 'Failed to disable role. Try again later.',
        type: 'error'
      });
      setConfirmDelete({ show: false, roleId: null });
    }
  };

  return (
    <div className="admin-view-role-container">
      <h2>Role List</h2>

      {popup.show && (
        <PopupMessage
          isOpen={popup.show}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      {/* ✅ Delete confirmation popup */}
      {confirmDelete.show && (
        <div className="admin-popup-overlay" onClick={() => setConfirmDelete({ show: false, roleId: null })}>
          <div className="admin-popup-box warning" onClick={(e) => e.stopPropagation()}>
            <div className="admin-popup-icon">⚠️</div>
            <p>Are you sure you want to delete this role?</p>
            <div className="admin-popup-actions">
              <button className="admin-popup-close-btn" onClick={() => setConfirmDelete({ show: false, roleId: null })}>
                No
              </button>
              <button className="admin-popup-close-btn" onClick={handleConfirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="admin-roles-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Company</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id}>
              <td>{index + 1}</td>
              <td>{role.first_name} {role.last_name}</td>
              <td>{role.email}</td>
              <td>{role.mobile_no}</td>
              <td>{role.company_name}</td>
              <td>{role.role_type}</td>
              <td>
                <FaRegEdit
                  className="admin-edit-icon"
                  onClick={() => handleEditClick(role.id)}
                />
                {role.status === 1 ? (
                  <RiDeleteBin5Fill
                    className="admin-delete-icon"
                    onClick={() => setConfirmDelete({ show: true, roleId: role.id })}
                  />
                ) : (
                  <span className="admin-disabled-delete">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRole;
