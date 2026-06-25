import React from 'react';
import { NavLink } from 'react-router-dom'; // Using NavLink for navigation

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Audit</h2>
        <p>IPS System</p>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="menu-item">Dashboard</NavLink>
        <NavLink to="/add-doctor" className="menu-item">Add Doctor</NavLink>
        <NavLink to="/register-patient" className="menu-item">Register Patient</NavLink>
        <NavLink to="/inventory" className="menu-item">Inventory</NavLink>
        <NavLink to="/register-product" className="menu-item">Register Product</NavLink>
        <NavLink to="/entradas" className="menu-item">Entries</NavLink>
        <NavLink to="/salidas" className="menu-item">Exits</NavLink>
        <NavLink to="/alertas" className="menu-item">Alerts</NavLink>
        <NavLink to="/reportes" className="menu-item">Reports</NavLink>
        <NavLink to="/configuracion" className="menu-item">Settings</NavLink>
      </nav>

      <div className="user-profile">
        <div className="avatar">AD</div>
        <div className="user-info">
          <p>Administrator</p>
          <small>admin@ips.com</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;