import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Medicines from './Medicines';
import './App.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ TOTAL_STOCK: 0, URGENT_ALERTS: 0, doctors: 0, patients: 0 });
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ MEDICINENAME: '', QUANTITYINSTOCK: '', UNITPRICE: '' });

  const lineData = [
    { name: 'Jan', Entries: 120, Exits: 80 }, { name: 'Feb', Entries: 150, Exits: 90 },
    { name: 'Mar', Entries: 190, Exits: 110 }, { name: 'Apr', Entries: 140, Exits: 90 },
    { name: 'May', Entries: 200, Exits: 130 }, { name: 'Jun', Entries: 170, Exits: 100 },
  ];

  const barData = [
    { name: 'Medicines', value: 450 }, { name: 'Supplies', value: 300 },
    { name: 'Equipment', value: 180 }, { name: 'Surgical Mat.', value: 200 }, { name: 'Others', value: 100 },
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Activity Log Report", 20, 10);
    doc.autoTable({
      head: [['Type', 'Product', 'Quantity', 'Responsible', 'Status']],
      body: activities.map(a => [a.TIPO, a.PRODUCTO, a.CANTIDAD, a.RESPONSABLE, a.ESTADO]),
    });
    doc.save('activity_report.pdf');
  };

  const handleSubmit = () => {
    axios.post('http://localhost:5000/api/medicines', formData)
      .then(() => { alert("Medicine Added!"); setShowForm(false); })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/stats').then(res => setStats(res.data));
    axios.get('http://localhost:5000/api/activity').then(res => setActivities(res.data));
  }, []);

  return (
    <div className="dashboard-container">
     
<div className="hero-banner">
  <div style={{ maxWidth: '60%' }}>
    <h2>No need to visit local hospitals</h2>
    <p>Get your consultation online - Audio/text/video</p>
    <button className="consult-btn">Consult a Doctor</button>
  </div>
  
  <img 
    src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" 
    alt="Doctor" 
    style={{ width: '150px', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.2))' }} 
  />
</div>

      {/* Recommended Doctors Row */}
<h3>Recommended Doctors</h3>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
  {[
    { name: 'AMANDA CLARA', spec: 'Pediatric', exp: '10 years', img: 'amanda.jpg' },
    { name: 'JASON SHATSKY', spec: 'Surgical', exp: '10 years', img: 'jason.jpg' },
    { name: 'JESSIE DUX', spec: 'Gastro', exp: '10 years', img: 'jessie.jpg' }
  ].map((doc, i) => (
    <div key={i} className="doctor-card" style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <img 
        src={require(`./assets/${doc.img}`)} 
        alt={doc.name} 
        style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', objectFit: 'cover' }} 
      />
      <h4 style={{ margin: '5px 0' }}>{doc.name}</h4>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>{doc.spec} | {doc.exp} experience</p>
      <button 
        className="btn-book" 
        style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}
      >
        Book an appointment
      </button>
    </div>
  ))}
</div>

      <hr style={{ margin: '20px 0' }} />
      <h2>Inventory Overview</h2>

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '15px', marginBottom: '20px' }}>
        {[
          { label: 'Available Products', value: stats.TOTAL_STOCK },
          { label: 'Out of Stock', value: '23' },
          { label: 'Recent Entries', value: '145' },
          { label: 'Recent Exits', value: '89' },
          { label: 'Expiry Alerts', value: stats.URGENT_ALERTS },
          { label: 'Total Doctors', value: stats.doctors }, 
          { label: 'Total Patients', value: stats.patients }, 
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '15px' }}>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{stat.label}</p>
            <h2 style={{ fontSize: '1.5rem', margin: '5px 0' }}>{stat.value !== undefined ? stat.value : 0}</h2>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="glass-card">
          <h3>Inventory Movement</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none' }} />
              <Line type="monotone" dataKey="Entries" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Exits" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: 'none' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <Medicines />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowForm(!showForm)} className="add-btn" style={{ marginRight: '10px' }}>
          {showForm ? 'Cancel' : 'Add Medicine'}
        </button>
        <button onClick={exportPDF} className="add-btn" style={{ background: '#3b82f6' }}>Export to PDF</button>
      </div>

      {showForm && (
        <div className="glass-card" style={{ marginBottom: '20px' }}>
          <h3>Add New Medicine</h3>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <input className="input-field" placeholder="Medicine Name" onChange={(e) => setFormData({...formData, MEDICINENAME: e.target.value})} />
            <input className="input-field" placeholder="Quantity" type="number" onChange={(e) => setFormData({...formData, QUANTITYINSTOCK: e.target.value})} />
            <button onClick={handleSubmit} className="add-btn">Submit</button>
          </div>
        </div>
      )}

      <div className="glass-card">
        <h3>Recent Activity</h3>
        <table className="activity-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ color: 'rgba(255, 255, 255, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th>Type</th><th>Product</th><th>Quantity</th><th>Responsible</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((act, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td>{act.TIPO}</td><td>{act.PRODUCTO}</td><td>{act.CANTIDAD}</td><td>{act.RESPONSABLE}</td><td>{act.ESTADO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;