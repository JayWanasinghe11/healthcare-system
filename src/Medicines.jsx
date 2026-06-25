import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

 
  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      setMedicines(res.data);
    } catch (err) { console.error("Error fetching medicines:", err); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  // Delete function
  const deleteMedicine = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      fetchMedicines();
    } catch (err) { alert("Error deleting medicine"); }
  };

  
  const updateQty = async (id) => {
    const newQty = prompt("Enter new quantity:");
    if (newQty) {
      try {
        await axios.put(`http://localhost:5000/api/medicines/${id}`, { QUANTITYINSTOCK: newQty });
        fetchMedicines();
      } catch (err) { alert("Error updating quantity"); }
    }
  };

 
  const filteredMedicines = medicines.filter(med => 
    med.MEDICINENAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Search by name, code or lot..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '8px' }}
        />
      </div>

      <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>CODE</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>NAME</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>CATEGORY</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>EXPIRY</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>QTY</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicines.map(med => (
            <tr key={med.MEDICINEID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '15px' }}>{med.MEDICINEID}</td>
              <td style={{ padding: '15px' }}>{med.MEDICINENAME}</td>
              <td style={{ padding: '15px' }}>Medicine</td>
              <td style={{ padding: '15px' }}>{med.EXPIRYDATE ? med.EXPIRYDATE.split('T')[0] : 'N/A'}</td>
              <td style={{ padding: '15px' }}>{med.QUANTITYINSTOCK}</td>
              <td style={{ padding: '15px' }}>
                <button title="View" style={{ marginRight: '10px' }}>👁️</button>
                <button title="Edit" onClick={() => updateQty(med.MEDICINEID)} style={{ marginRight: '10px' }}>✎</button>
                <button title="Delete" onClick={() => deleteMedicine(med.MEDICINEID)} style={{ color: '#ff4d4d' }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Medicines;