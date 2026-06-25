import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState({ FULL_NAME: '', EMAIL: '', ROLE: '' });
  const tabs = ['Profile', 'Notifications', 'Institution', 'Roles & Permissions'];

  useEffect(() => {
   
    const userId = 1; 
    axios.get(`http://localhost:5000/api/profile/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  return (
    <div className="settings-container" style={{ padding: '30px', color: '#fff', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Configuration</h2>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', border: 'none', color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
              padding: '10px 0', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
              fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >{tab}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content glass-card" style={{ padding: '30px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)' }}>
        {activeTab === 'Profile' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>AD</div>
              <button style={{ background: 'transparent', border: '1px solid #fff', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Change Photo</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label>Full Name</label>
                <input 
                  className="input-field" 
                  value={user.FULL_NAME || ''} 
                  onChange={(e) => setUser({...user, FULL_NAME: e.target.value})} 
                />
              </div>
              <div>
                <label>Email</label>
                <input 
                  className="input-field" 
                  value={user.EMAIL || ''} 
                  onChange={(e) => setUser({...user, EMAIL: e.target.value})} 
                />
              </div>
              <div>
                <label>Phone</label>
                <input className="input-field" placeholder="+57 300 123 4567" />
              </div>
              <div>
                <label>Role</label>
                <input 
                  className="input-field" 
                  value={user.ROLE || ''} 
                  onChange={(e) => setUser({...user, ROLE: e.target.value})} 
                />
              </div>
            </div>

            <h3 style={{ marginTop: '30px', borderTop: '1px solid #444', paddingTop: '20px' }}>Change Password</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <input className="input-field" type="password" placeholder="Current Password" />
              <input className="input-field" type="password" placeholder="New Password" />
              <input className="input-field" type="password" placeholder="Confirm Password" />
            </div>
            <button style={{ marginTop: '20px', padding: '10px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>Save Changes</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;