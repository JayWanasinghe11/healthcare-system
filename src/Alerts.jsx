import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/alerts') 
      .then(res => setAlerts(res.data))
      .catch(err => console.error("Error fetching alerts:", err));
  }, []);

  const alertCards = [
    { title: 'Critical Alerts', count: '2', color: '#ff4d4f' },
    { title: 'High Alerts', count: '1', color: '#faad14' },
    { title: 'Medium Alerts', count: '2', color: '#faad14' },
    { title: 'Expiring Soon', count: '3', color: '#3b82f6' },
  ];

  return (
    <div className="dashboard-container">
      <h2>Alerts and Notifications</h2>
      <p style={{ opacity: 0.6 }}>Monitored products with expiry and stock alerts</p>

      {/* Top Alert Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {alertCards.map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{card.title}</p>
              <h2 style={{ fontSize: '1.8rem', margin: '5px 0' }}>{card.count}</h2>
            </div>
            <div style={{ background: card.color, width: '30px', height: '30px', borderRadius: '50%', opacity: 0.2 }} />
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="glass-card" style={{ display: 'flex', gap: '10px', padding: '15px', marginBottom: '20px' }}>
        <input className="input-field" placeholder="Search alerts..." style={{ margin: 0 }} />
        <select className="input-field" style={{ margin: 0 }}><option>All Types</option></select>
        <select className="input-field" style={{ margin: 0 }}><option>All Priorities</option></select>
      </div>

      {/* Alert Items */}
      <div className="glass-card">
        {alerts.map((alert, index) => (
          <div key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: '#ff4d4f' }}>{alert.MEDICINENAME}</h3>
              <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Type: {alert.TYPE} | Lot: {alert.LOT}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.9rem' }}>Status: Active</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="add-btn" style={{ background: 'transparent', border: '1px solid #fff' }}>Details</button>
              <button className="add-btn" style={{ background: '#3b82f6' }}>Mark Resolved</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;