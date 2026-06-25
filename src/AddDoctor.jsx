import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddDoctor = () => {
  const [formData, setFormData] = useState({ name: '', spec: '', contact: '' });
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchDoctors = () => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchDoctors(); }, []);

  // Delete
  const deleteDoctor = (id) => {
    console.log("Deleting ID:", id); 
    axios.delete(`http://localhost:5000/api/doctors/${id}`)
      .then(() => {
        toast.success("Doctor deleted!");
        fetchDoctors();
      })
      .catch(err => {
        console.error(err);
        toast.error("Error deleting doctor");
      });
  };

  // Edit
  const startEdit = (doc) => {
    setEditingId(doc.DOCTORID);
    setFormData({ name: doc.NAME, spec: doc.SPECIALIZATION, contact: doc.CONTACTNO });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update/Edit logic
      axios.put(`http://localhost:5000/api/doctors/${editingId}`, formData)
        .then(() => {
          toast.success("Doctor updated!");
          setEditingId(null);
          setFormData({ name: '', spec: '', contact: '' });
          fetchDoctors();
        })
        .catch(err => {
          console.error(err);
          toast.error("Error updating doctor");
        });
    } else {
      // Add logic
      axios.post('http://localhost:5000/api/doctors/add', formData)
        .then(() => {
          toast.success("Doctor added!");
          fetchDoctors();
          setFormData({ name: '', spec: '', contact: '' });
        })
        .catch(err => {
          console.error(err);
          toast.error("Error adding doctor");
        });
    }
  };

  return (
    <div className="doctor-container">
      <div className="doctor-card">
        <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
          {editingId ? 'Edit Doctor' : 'Add New Doctor'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input className="input-field" placeholder="Doctor Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input className="input-field" placeholder="Specialization" value={formData.spec} onChange={e => setFormData({...formData, spec: e.target.value})} required />
            <input className="input-field" placeholder="Contact Number" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} required />
          </div>
          <button type="submit" className="add-btn">
            {editingId ? 'Update Doctor' : '+ Add Doctor'}
          </button>
          {editingId && (
            <button type="button" className="add-btn" style={{ marginLeft: '10px', background: '#64748b' }} onClick={() => { setEditingId(null); setFormData({ name: '', spec: '', contact: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="doctor-card">
        <h3 style={{ marginBottom: '10px', color: '#1e293b' }}>Doctor List</h3>
        <table className="table-custom">
          <thead>
            <tr>
              <th>Name</th><th>Specialization</th><th>Contact</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.DOCTORID}>
                <td style={{ fontWeight: '600', color: '#1e293b' }}>{doc.NAME}</td>
                <td>
                  <span style={{ background: '#f1f5f9', padding: '5px 10px', borderRadius: '5px', fontSize: '0.85rem' }}>
                    {doc.SPECIALIZATION}
                  </span>
                </td>
                <td>{doc.CONTACTNO}</td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => startEdit(doc)}>Edit</button>
                  <button className="btn-action btn-delete" onClick={() => deleteDoctor(doc.DOCTORID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddDoctor;