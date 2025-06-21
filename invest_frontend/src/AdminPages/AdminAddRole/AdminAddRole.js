// import React, { useState } from 'react';
// import './AdminAddRole.css';
// import 'react-phone-input-2/lib/style.css'; 
// import PopupMessage from "../../components/PopupMessage/PopupMessage";
// import PhoneInput from 'react-phone-input-2';


// const AddRole = () => {
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     mobile_no: '',
//     company_name: '',
//     role_type: '',
//     admin_id: ''
//   });

//   const [popup, setPopup] = useState({
//     show: false,
//     message: '',
//     type: ''
//   });

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handlePhoneChange = (value) => {
//   setFormData(prev => ({
//     ...prev,
//     mobile_no: value
//   }));
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('http://127.0.0.1:8080/register-role', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setPopup({
//           show: true,
//           message: data.message || "Role registered successfully.",
//           type: 'success'
//         });
//         setFormData({
//           first_name: '',
//           last_name: '',
//           email: '',
//           mobile_no: '',
//           company_name: '',
//           role_type: ''
//         });
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
//     <div className="admin-add-role-container">
//       <h2>Add Role</h2>

//       {popup.show && (
//         <PopupMessage
//          isOpen={popup.show}
//           message={popup.message}
//           type={popup.type}
//           onClose={() => setPopup({ ...popup, show: false })}
//         />
//       )}

//       <form onSubmit={handleSubmit} className="admin-role-form">
//         <div className="admin-form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             name="first_name"
//             placeholder="Enter first name"
//             value={formData.first_name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="admin-form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             name="last_name"
//             placeholder="Enter last name"
//             value={formData.last_name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="admin-form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="admin-form-group">
//           <label>Mobile Number</label>
//           <PhoneInput
//   country={'in'}
//   preferredCountries={['in']}
//   disableDropdown={true}
//   value={formData.mobile_no}
//   onChange={(value) =>
//     handlePhoneChange(value.startsWith('+') ? value : '+' + value)
//   }
//   inputStyle={{ width: '100%' }}
//   inputProps={{
//     name: 'mobile_no',
//     required: true
//   }}
// />

//         </div>

//         <div className="admin-form-group">
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

//         <div className="admin-form-group">
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

//         <button type="submit" className="submit-btn">Add Role</button>
//       </form>
//     </div>
//   );
// };

// export default AddRole;
import React, { useState } from 'react';
import './AdminAddRole.css';
import 'react-phone-input-2/lib/style.css';
import PopupMessage from '../../components/PopupMessage/PopupMessage';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
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

  const navigate = useNavigate();

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
      const response = await fetch('http://127.0.0.1:8080/register-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setPopup({
          show: true,
          message: data.message || "Role registered successfully.",
          type: 'success'
        });

        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          mobile_no: '',
          company_name: '',
          role_type: '',
          admin_id: sessionStorage.getItem('admin_id') || ''
        });

        setTimeout(() => {
          navigate('/view-team'); // 👈 Route to view roles
        }, 1000);
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
    <div className="admin-add-role-container">
      <h2>Add Role</h2>

      {popup.show && (
        <PopupMessage
          isOpen={popup.show}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}

      <form onSubmit={handleSubmit} className="admin-role-form">
        <div className="admin-form-group">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Mobile Number</label>
          <PhoneInput
            country={'in'}
            preferredCountries={['in']}
            disableDropdown={true}
            value={formData.mobile_no}
            onChange={handlePhoneChange}
            inputStyle={{ width: '100%' }}
            inputProps={{
              name: 'mobile_no',
              required: true
            }}
          />
        </div>

        <div className="admin-form-group">
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

        <div className="admin-form-group">
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

        <button type="submit" className="submit-btn">Add Role</button>
      </form>
    </div>
  );
};

export default AddRole;
