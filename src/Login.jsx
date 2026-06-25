import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token);
        toast.success("Login Successful!");
        navigate('/dashboard');
      })
      .catch(() => toast.error("Invalid Credentials!"));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="login-container">
        <h2 style={{ marginBottom: '30px', color: '#fff' }}>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input 
            className="input-field" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            className="input-field" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.6)' }}>
          Don't have an account? 
          <a href="/register" style={{ color: '#6c63ff', marginLeft: '5px' }}>Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;