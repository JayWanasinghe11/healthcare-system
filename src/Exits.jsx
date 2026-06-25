import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exits = () => {
  const [exits, setExits] = useState([]);

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/exits')
      .then(res => setExits(res.data))
      .catch(err => console.error("Error fetching exits:", err));
  }, []);

  return (
    <div className="glass-card" style={{ padding: '30px', borderRadius: '15px', color: '#fff' }}>
      <h2>Inventory Exits</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>DATE</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>PRODUCT</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>QUANTITY</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {exits.map((exit, index) => (
            <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '15px' }}>{exit.DATE}</td>
              <td style={{ padding: '15px' }}>{exit.PRODUCT}</td>
              <td style={{ padding: '15px' }}>{exit.QUANTITY}</td>
              <td style={{ padding: '15px' }}>{exit.STATUS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Exits;