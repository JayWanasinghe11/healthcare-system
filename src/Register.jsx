import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

const Register = () => {
  const [creds, setCreds] = useState({ username: '', password: '', fullname: '', role: 'Staff' });

  const handleRegister = async (e) => {
    e.preventDefault(); 
    try {
      await axios.post('http://localhost:5000/api/register', {
        username: creds.username,
        password: creds.password,
        fullname: creds.fullname,
        role: creds.role
      });
      
      
      toast.success('Account created successfully!', {
        style: { background: '#333', color: '#fff' },
      });
      
      window.location.href = '/login'; 
    } catch (err) {
      toast.error('Registration failed!'); 
      console.error("Register Error:", err);
    }
  };

  return (
    <div className="login-container glass-card" style={{ padding: '50px', maxWidth: '400px', margin: '50px auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input 
          className="input-field" 
          placeholder="Full Name" 
          onChange={(e) => setCreds({...creds, fullname: e.target.value})} 
          required 
        />
        <input 
          className="input-field" 
          placeholder="New Username (Email)" 
          onChange={(e) => setCreds({...creds, username: e.target.value})} 
          required 
        />
        <input 
          className="input-field" 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setCreds({...creds, password: e.target.value})} 
          required 
        />
        
        <select 
          className="input-field" 
          onChange={(e) => setCreds({...creds, role: e.target.value})} 
          style={{ color: '#000', marginBottom: '20px' }}
        >
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>
        
        <button type="submit" className="login-btn">Register</button>
      </form>
      
      <p style={{ marginTop: '20px', color: '#fff' }}>
        Already have an account? <a href="/login" style={{ color: '#6c63ff' }}>Login here</a>
      </p>
    </div>
  );
};

export default Register;