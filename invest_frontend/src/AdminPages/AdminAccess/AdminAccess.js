import React, { useState } from 'react';
import './AdminAccess.css';

const users = [
  { id: 1, name: 'Varsha', email: 'varsha@kapilitshub.com' },
  { id: 2, name: 'Ravi', email: 'ravi@kapilitshub.com' },
  { id: 3, name: 'Meena', email: 'meena@kapilitshub.com' }
];

const permissions = [
  'View campaigns and use planning tools',
  'Customer Details',
  'KYC Details',
  'Nominee Details',
  'View billing information',
  'Edit billing information',
  'View reports',
  'Edit reports',
  'View users, managers, and product links',
  'Add email only users',
  'Edit users, managers, and product links'
];

const AccessAndSecurity = () => {
  const [selectedUser, setSelectedUser] = useState(users[0].email);
  const [expire, setExpire] = useState('Never');
  const [accessRights, setAccessRights] = useState({});

  const handleCheckboxChange = (permission) => {
    setAccessRights((prev) => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const getUserName = (email) => {
    const user = users.find(u => u.email === email);
    return user ? user.name : '';
  };

  return (
    <div className="admin-access-container">
      <h2>Access and Security</h2>

      <div className="admin-access-form">
        <label>Email:</label>
        <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
        <span className="admin-username-display">({getUserName(selectedUser)})</span>

        <label>Access Expires:</label>
        <select value={expire} onChange={(e) => setExpire(e.target.value)}>
          <option value="1 Year">1 Year</option>
          <option value="6 Months">6 Months</option>
          <option value="Never">Never</option>
        </select>
      </div>

      <table className="admin-access-table">
        <thead>
          <tr>
            <th>Permission</th>
            <th>Allowed</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission, idx) => (
            <tr key={idx}>
              <td>{permission}</td>
              <td>
                <input
                  type="checkbox"
                  checked={accessRights[permission] || false}
                  onChange={() => handleCheckboxChange(permission)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessAndSecurity;
