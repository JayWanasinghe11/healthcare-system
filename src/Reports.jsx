import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = () => {
  const data = [
    { name: 'Jan', value: 4000 }, { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 }, { name: 'Apr', value: 4500 },
    { name: 'May', value: 4200 }, { name: 'Jun', value: 6000 },
  ];

  const pieData = [
    { name: 'Medicines', value: 400 }, { name: 'Supplies', value: 300 },
    { name: 'Equipment', value: 300 }, { name: 'Other', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2>Reportes</h2>
      
      {/* Chart Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ flex: 2, padding: '20px' }}>
          <h3>Inventory Value Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ flex: 1, padding: '20px' }}>
          <h3>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} label>
                {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 1. Generate New Report Section */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3>Generate New Report</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <select className="input-field" style={{ flex: 1 }}>
            <option>Select Type...</option>
          </select>
          <input type="date" className="input-field" style={{ flex: 1 }} />
          <input type="date" className="input-field" style={{ flex: 1 }} />
          <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Generate</button>
        </div>
      </div>

      {/* 2. Recent Reports Table Section */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <h3>Recent Reports</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', color: '#fff' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #444' }}>
              <th style={{ padding: '10px' }}>NAME</th>
              <th style={{ padding: '10px' }}>TYPE</th>
              <th style={{ padding: '10px' }}>DATE</th>
              <th style={{ padding: '10px' }}>STATUS</th>
              <th style={{ padding: '10px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px' }}>General Inventory - May 2026</td>
              <td style={{ padding: '10px' }}>Inventory</td>
              <td style={{ padding: '10px' }}>2026-05-27</td>
              <td style={{ padding: '10px', color: '#00C49F' }}>Completed</td>
              <td style={{ padding: '10px' }}>⬇ Download</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;