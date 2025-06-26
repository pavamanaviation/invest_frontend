import React, { useState, useEffect } from 'react';
import './AdminAccess.css';
import API_BASE_URL from '../../config';

const users = [
  { id: 1, name: 'Varsha', email: 'varsha@kapilitshub.com' },
  { id: 2, name: 'Ravi', email: 'ravi@kapilitshub.com' },
  { id: 3, name: 'Meena', email: 'meena@kapilitshub.com' }
];

const AccessAndSecurity = () => {
  const [selectedUser, setSelectedUser] = useState(users[0].email);
  const [expire, setExpire] = useState('Never');
  const [accessRights, setAccessRights] = useState({});
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/permission-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ admin_id: sessionStorage.getItem('admin_id') }),
        });
        const data = await res.json();
        if (data.models) {
          setPermissions(Object.values(data.models));
        }
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
      }
    };

    fetchPermissions();
  }, []);

  const handleCheckboxChange = (permission) => {
    setAccessRights((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        allowed: !prev[permission]?.allowed,
        mode: prev[permission]?.mode || 'view'
      }
    }));
  };

  const handleModeChange = (permission, mode) => {
    setAccessRights((prev) => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        mode
      }
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
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission, idx) => {
            const rights = accessRights[permission] || {};
            return (
              <tr key={idx}>
                <td>{permission}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={rights.allowed || false}
                    onChange={() => handleCheckboxChange(permission)}
                  />
                </td>
                <td>
                  {rights.allowed && (
                    <div className="mode-radio-group">
                      {['view', 'edit', 'delete'].map((mode) => (
                        <label key={mode} className="mode-radio">
                          <input
                            type="radio"
                            name={`mode-${idx}`}
                            value={mode}
                            checked={rights.mode === mode}
                            onChange={() => handleModeChange(permission, mode)}
                          />
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </label>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AccessAndSecurity;
