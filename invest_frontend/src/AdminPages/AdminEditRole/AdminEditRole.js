// import React, { useEffect, useState } from 'react';
// import './AdminEditRole.css';
// import 'react-phone-input-2/lib/style.css';
// import PopupMessage from '../../components/PopupMessage/PopupMessage';
// import PhoneInput from 'react-phone-input-2';
// import { useNavigate } from 'react-router-dom';

// const EditRole = () => {
//   const navigate = useNavigate();
//   const role_id = sessionStorage.getItem('edit_role_id'); // ✅ Get from sessionStorage

//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     mobile_no: '',
//     company_name: '',
//     role_type: '',
//     admin_id: sessionStorage.getItem('admin_id') || ''
//   });

//   const [popup, setPopup] = useState({
//     show: false,
//     message: '',
//     type: ''
//   });

//   // ✅ Fetch specific role data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/view-roles', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ admin_id: sessionStorage.getItem('admin_id') })
//         });
//         const data = await response.json();
//         if (response.ok) {
//           const selected = data.roles.find(r => r.id === parseInt(role_id));
//           if (selected) {
//             setFormData(prev => ({ ...prev, ...selected }));
//           }
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//       }
//     };

//     if (role_id) {
//       fetchData();
//     }
//   }, [role_id]);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handlePhoneChange = (value) => {
//     setFormData(prev => ({
//       ...prev,
//       mobile_no: value.startsWith('+') ? value : '+' + value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://127.0.0.1:8000/update-role', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...formData, role_id })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setPopup({
//           show: true,
//           message: data.message || "Role updated successfully.",
//           type: 'success'
//         });

//         setTimeout(() => {
//           sessionStorage.removeItem('edit_role_id');
//           navigate('/view-team');
//         }, 1500);
//       } else {
//         setPopup({
//           show: true,
//           message: data.error || 'Something went wrong.',
//           type: 'error'
//         });
//       }
//     } catch (err) {
//       setPopup({
//         show: true,
//         message: 'Server error. Please try again later.',
//         type: 'error'
//       });
//     }
//   };

//   return (
//     <div className="admin-edit-role-container">
//       <h2>Edit Role</h2>

//       {popup.show && (
//         <PopupMessage
//           isOpen={popup.show}
//           message={popup.message}
//           type={popup.type}
//           onClose={() => setPopup({ ...popup, show: false })}
//         />
//       )}

//       <form onSubmit={handleSubmit} className="admin-edit-role-form">
//         <div className="admin-edit-form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="admin-edit-form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="admin-edit-form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="admin-edit-form-group">
//           <label>Mobile Number</label>
//           <PhoneInput
//             country={'in'}
//             preferredCountries={['in']}
//             disableDropdown={true}
//             value={formData.mobile_no}
//             onChange={handlePhoneChange}
//             inputStyle={{ width: '100%' }}
//             inputProps={{ name: 'mobile_no', required: true }}
//           />
//         </div>

//         <div className="admin-edit-form-group">
//           <label>Company Name</label>
//           <select
//             name="company_name"
//             value={formData.company_name}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select company</option>
//             <option value="Pavaman Aviation">Pavaman Aviation</option>
//             <option value="Pavaman Agriculture">Pavaman Agriculture</option>
//           </select>
//         </div>

//         <div className="admin-edit-form-group">
//           <label>Role Type</label>
//           <select
//             name="role_type"
//             value={formData.role_type}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select role</option>
//             <option value="Financial Executive">Financial Executive</option>
//             <option value="Marketing Executive">Marketing Executive</option>
//           </select>
//         </div>

//         <button type="submit" className="edit-submit-btn">Update Role</button>
//       </form>
//     </div>
//   );
// };

// export default EditRole;
import React, { useEffect, useState } from 'react';
import './AdminEditRole.css';
import 'react-phone-input-2/lib/style.css';
import PopupMessage from '../../components/PopupMessage/PopupMessage';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';

const EditRole = () => {
  const navigate = useNavigate();
  const role_id = sessionStorage.getItem('edit_role_id');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: '',
    company_name: '',
    role_type: '',
    admin_id: sessionStorage.getItem('admin_id') || ''
  });

  const [popup, setPopup] = useState({
    show: false,
    message: '',
    type: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const admin_id = sessionStorage.getItem('admin_id');
      if (!admin_id || !role_id) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/view-roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_id })
        });
        const data = await response.json();

        if (response.ok && Array.isArray(data.roles)) {
          const role = data.roles.find(r => r.id === parseInt(role_id));
          if (role) {
            setFormData(prev => ({ ...prev, ...role }));
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      mobile_no: value.startsWith('+') ? value : '+' + value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, role_id })
      });

      const data = await response.json();

      if (response.ok) {
        setPopup({
          show: true,
          message: data.message || "Role updated successfully.",
          type: 'success'
        });

        setTimeout(() => {
          sessionStorage.removeItem('edit_role_id');
          navigate('/view-team');
        }, 1500);
      } else {
        setPopup({
          show: true,
          message: data.error || 'Something went wrong.',
          type: 'error'
        });
      }
    } catch (err) {
      setPopup({
        show: true,
        message: 'Server error. Please try again later.',
        type: 'error'
      });
    }
  };

  return (
    <div className="admin-edit-role-container">
      <h2>Edit Role</h2>

      {popup.show && (
        <PopupMessage
          isOpen={popup.show}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      <form onSubmit={handleSubmit} className="admin-edit-role-form">
        <div className="admin-edit-form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-edit-form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-edit-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-edit-form-group">
          <label>Mobile Number</label>
          <PhoneInput
            country={'in'}
            preferredCountries={['in']}
            disableDropdown={true}
            value={formData.mobile_no}
            onChange={handlePhoneChange}
            inputStyle={{ width: '100%' }}
            inputProps={{ name: 'mobile_no', required: true }}
          />
        </div>

        <div className="admin-edit-form-group">
          <label>Company Name</label>
          <select
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
          >
            <option value="">Select company</option>
            <option value="Pavaman Aviation">Pavaman Aviation</option>
            <option value="Pavaman Agriculture">Pavaman Agriculture</option>
          </select>
        </div>

        <div className="admin-edit-form-group">
          <label>Role Type</label>
          <select
            name="role_type"
            value={formData.role_type}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="Financial Executive">Financial Executive</option>
            <option value="Marketing Executive">Marketing Executive</option>
          </select>
        </div>

        <button type="submit" className="edit-submit-btn">Update Role</button>
      </form>
    </div>
  );
};

export default EditRole;
