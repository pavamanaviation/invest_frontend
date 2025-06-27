import React, { useState, useEffect, useMemo } from 'react';
import './AdminAccess.css';
import API_BASE_URL from '../../config';
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { HiMiniXMark } from "react-icons/hi2";
import { IoCheckmarkOutline } from "react-icons/io5";

const AccessAndSecurity = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [accessRights, setAccessRights] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [modelMap, setModelMap] = useState({});
  const [rolePermissionsCache, setRolePermissionsCache] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });

  const adminId = sessionStorage.getItem('admin_id');

  const selectedUserObj = useMemo(() => users.find(u => u.email === selectedUser), [selectedUser, users]);
  const [loading, setLoading] = useState(false);
const [showAllPermissions, setShowAllPermissions] = useState(false);
const [allPermissions, setAllPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissionData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/permission-data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_id: adminId }),
        });
        const data = await res.json();
        if (data.models) {
          setPermissions(Object.values(data.models));
          setModelMap(data.models);
        }
        if (data.roles?.length) {
          setUsers(data.roles);
          setSelectedUser(data.roles[0]?.email || '');
        }
      } catch (err) {
        setPopup({ isOpen: true, message: 'Failed to fetch data.', type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchPermissionData();
  }, [adminId]);

  useEffect(() => {
    if (!selectedUserObj) return;

    const loadPermissions = async () => {
      setLoading(true);
      if (rolePermissionsCache[selectedUserObj.id]) {
        setAccessRights(rolePermissionsCache[selectedUserObj.id]);
        setLoading(false);
        return;
      }

      try {

        const res = await fetch(`${API_BASE_URL}/view-all-role-permissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ admin_id: adminId }),
        });
        const data = await res.json();
        const roleData = data.roles_permission_details.find(r => r.role_id === selectedUserObj.id);

        if (!roleData) {
          setAccessRights({});
          setLoading(false);
          return;
        }

        const mapped = {};
        for (const perm of roleData.permissions) {
          mapped[perm.label] = {
            allowed: true,
            modes: {
              add: perm.can_add,
              view: perm.can_view,
              edit: perm.can_edit,
              delete: perm.can_delete,
            },
          };
        }
        setRolePermissionsCache(prev => ({ ...prev, [selectedUserObj.id]: mapped }));
        setAccessRights(mapped);
      } catch (err) {
        setPopup({ isOpen: true, message: 'Failed to load role permissions.', type: 'error' });
      } finally {
        setLoading(false); 
      }
    };

    setAccessRights({});
    setHasChanges(false);
    loadPermissions();
  }, [selectedUserObj, adminId]);

  const handleCheckboxChange = (permission) => {
    setHasChanges(true);
    setAccessRights(prev => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        allowed: !prev[permission]?.allowed,
        modes: prev[permission]?.modes || { add: false, view: false, edit: false, delete: false },
      },
    }));
  };

  const handleModeToggle = (permission, mode) => {
    setHasChanges(true);
    setAccessRights(prev => ({
      ...prev,
      [permission]: {
        ...prev[permission],
        modes: {
          ...prev[permission]?.modes,
          [mode]: !prev[permission]?.modes?.[mode],
        },
      },
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUserObj) return;

    const payload = {
      admin_id: adminId,
      role_id: selectedUserObj.id,
      permissions: Object.entries(accessRights)
        .filter(([_, v]) => v.allowed)
        .map(([label, v]) => {
          const modelName = Object.keys(modelMap).find(key => modelMap[key] === label);
          return {
            model_name: modelName,
            can_add: v.modes.add,
            can_view: v.modes.view,
            can_edit: v.modes.edit,
            can_delete: v.modes.delete,
          };
        }),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/assign-role-permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setPopup({ isOpen: true, message: 'Permissions saved successfully!', type: "success" });
        setRolePermissionsCache(prev => ({ ...prev, [selectedUserObj.id]: accessRights }));
        setHasChanges(false);
      } else {
        setPopup({ isOpen: true, message: result.error || 'Failed to save.', type: "error" });
      }
    } catch (err) {
      setPopup({ isOpen: true, message: 'Save failed.', type: "error" });
    }
  };

  const handleToggleAllPermissions = async () => {
  setShowAllPermissions(!showAllPermissions);
  if (!showAllPermissions && allPermissions.length === 0) {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/view-all-role-permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: adminId }),
      });
      const data = await res.json();
      setAllPermissions(data.roles_permission_details || []);
    } catch (err) {
      setPopup({ isOpen: true, message: 'Failed to load all permissions.', type: "error" });
    } finally {
      setLoading(false);
    }
  }
};


  return (
    <div className="admin-access-container">
      <div className="admin-customer-heading">Access and Security</div>
      <PopupMessage {...popup} onClose={() => setPopup({ ...popup, isOpen: false })} />

      <div className="admin-access-form">
        <div>
          <label>Email:</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="admin-custom-select"
          >
            {users.map(user => (
              <option key={user.id} value={user.email}>{user.email}</option>
            ))}
          </select>
        </div>
        <div>

          {selectedUserObj && (
            <div className="admin-user-details-box">
              <div><strong>Employee Name:</strong> {selectedUserObj.first_name} {selectedUserObj.last_name}</div>
              <div><strong>Employee Type:</strong> {selectedUserObj.role_type}</div>
              <div><strong>Company Name:</strong> {selectedUserObj.company_name}</div>
            </div>
          )}
        </div>

<div className='admin-view-all' onClick={handleToggleAllPermissions}>
  {showAllPermissions ? 'Hide Permissions Table' : 'View All Permissions'}
</div>

      </div>
      {loading && (
        <div className="admin-loader">
          <div>Loading ...</div>
        </div>
      )}

{!showAllPermissions ? (
  <>
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
                  <div className="mode-check-group">
                    {['add', 'view', 'edit', 'delete'].map((mode) => (
                      <label key={mode} className={`mode-check ${rights.modes?.[mode] ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={rights.modes?.[mode] || false}
                          onChange={() => handleModeToggle(permission, mode)}
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

    <div className='admin-save-btn-div'>
      <button
        className='admin-save-btn'
        onClick={handleSavePermissions}
        disabled={!hasChanges}
        style={{ opacity: hasChanges ? 1 : 0.6, cursor: hasChanges ? 'pointer' : 'not-allowed' }}
      >
        Save Changes
      </button>
    </div>
  </>
) : (
<div className="all-permissions-table-container">
  <table className="admin-access-table two-row-header">
    <thead>
      <tr>
        <th rowSpan="2">Email</th>
        <th rowSpan="2">Role Type</th>
        {["Customer Details", "Kyc Details", "Customer More Details", "Payment Details", "Nominee Details"].map((model) => (
          <th colSpan="4" key={model}>{model}</th>
        ))}
      </tr>
      <tr>
        {["Customer Details", "Kyc Details", "Customer More Details", "Payment Details", "Nominee Details"].flatMap(() =>
          ['add', 'view', 'edit', 'delete'].map(mode => (
            <th key={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</th>
          ))
        )}
      </tr>
    </thead>
    <tbody>
      {allPermissions.map((role, idx) => (
        <tr key={idx}>
          <td>{role.email}</td>
          <td>{role.role_type}</td>
          {["Customer Details", "Kyc Details", "Customer More Details", "Payment Details", "Nominee Details"].flatMap((model) => {
            const perm = role.permissions.find(p => p.label === model);
            return ['can_add', 'can_view','can_edit', 'can_delete'].map(key => (
              <td key={`${role.email}-${model}-${key}`} className='admin-tick-cross'>
                {perm?.[key] ? <span className='admin-tick'><IoCheckmarkOutline/></span> :
                <span className='admin-cross'><HiMiniXMark/>
                  </span>}
              </td>
            ));
          })}
        </tr>
      ))}
    </tbody>
  </table>
</div>

)}

    </div>
  );
};

export default AccessAndSecurity;
