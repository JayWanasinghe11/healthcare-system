import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Entries = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/entries')
      .then(res => setEntries(res.data))
      .catch(err => console.error("Error fetching entries:", err));
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Inventory Entries</h2>
        <button className="add-btn" style={{ background: '#000', border: '1px solid #fff' }}>+ New Entry</button>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '15px' }}>
        <input className="input-field" placeholder="Search entries by product, supplier or lot..." style={{ margin: 0 }} />
      </div>

      {/* Entries Table */}
      <div className="glass-card">
        <h3>Entries History</h3>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>PRODUCT</th>
              <th>QUANTITY</th>
              <th>LOT</th>
              <th>SUPPLIER</th>
              <th>RESPONSIBLE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((item, i) => (
              <tr key={i}>
                <td>{item.DATE}</td>
                <td>{item.PRODUCT}</td>
                <td style={{ color: '#10b981', fontWeight: 'bold' }}>{item.QUANTITY}</td>
                <td>{item.LOT}</td>
                <td>{item.SUPPLIER}</td>
                <td>{item.RESPONSIBLE}</td>
                <td>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '5px 10px', borderRadius: '10px', color: '#10b981', fontSize: '0.8rem' }}>
                    {item.STATUS}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Entries;