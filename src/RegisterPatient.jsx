import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPatient = () => {
  const [patient, setPatient] = useState({ name: '', dob: '', contact: '', gender: 'Male', nic: '' });
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null); 

  const fetchPatients = () => {
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchPatients(); }, []);

  // Delete කරන්න
  const deletePatient = (id) => {
    axios.delete(`http://localhost:5000/api/patients/${id}`)
      .then(() => {
        toast.success("Patient deleted!");
        fetchPatients();
      })
      .catch(err => {
        console.error(err);
        toast.error("Error deleting patient");
      });
  };

 
  const startEdit = (patient) => {
    setEditingId(patient.PATIENTID);
    setPatient({ 
      name: patient.NAME, 
      dob: patient.DOB, 
      contact: patient.CONTACTNO, 
      gender: patient.GENDER, 
      nic: patient.NIC 
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Edit/Update Logic
      axios.put(`http://localhost:5000/api/patients/${editingId}`, patient)
        .then(() => {
          toast.success("Patient Updated!");
          setEditingId(null);
          setPatient({ name: '', dob: '', contact: '', gender: 'Male', nic: '' });
          fetchPatients();
        })
        .catch(() => toast.error("Update Failed"));
    } else {
      // Add Logic
      axios.post('http://localhost:5000/api/register-patient', patient)
        .then(() => {
          toast.success("Patient Registered!");
          fetchPatients();
          setPatient({ name: '', dob: '', contact: '', gender: 'Male', nic: '' });
        })
        .catch(() => toast.error("Registration Failed"));
    }
  };

  return (
    <div className="doctor-container">
      <div className="doctor-card">
        <h3>{editingId ? 'Edit Patient' : 'Register Patient'}</h3>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input className="input-field" placeholder="Full Name" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} required />
            <input className="input-field" type="date" value={patient.dob} onChange={e => setPatient({...patient, dob: e.target.value})} required />
            <input className="input-field" placeholder="Contact Info" value={patient.contact} onChange={e => setPatient({...patient, contact: e.target.value})} required />
            <input className="input-field" placeholder="NIC Number" value={patient.nic} onChange={e => setPatient({...patient, nic: e.target.value})} required />
            <select className="input-field" value={patient.gender} onChange={e => setPatient({...patient, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <button type="submit" className="add-btn">{editingId ? 'Update' : 'Register'}</button>
          {editingId && (
            <button type="button" className="add-btn" style={{ marginLeft: '10px', background: '#64748b' }} onClick={() => { setEditingId(null); setPatient({ name: '', dob: '', contact: '', gender: 'Male', nic: '' }); }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="doctor-card">
        <h3>Patient List</h3>
        <table className="table-custom">
          <thead>
            <tr>
              <th>Name</th><th>DOB</th><th>Contact</th><th>NIC</th><th>Gender</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '600', color: '#1e293b' }}>{p.NAME}</td>
                <td>{new Date(p.DOB).toLocaleDateString()}</td>
                <td>{p.CONTACTNO}</td>
                <td>{p.NIC}</td>
                <td>{p.GENDER}</td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn-action btn-delete" onClick={() => deletePatient(p.PATIENTID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterPatient;