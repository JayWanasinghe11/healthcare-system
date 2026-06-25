import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import Medicines from './Medicines';
import ProductRegister from './ProductRegister';
import Entries from './Entries';
import Exits from './Exits';
import Reports from './Reports';
import Alerts from './Alerts';
import Settings from './Settings';
import ProtectedRoute from './ProtectedRoute';
import AddDoctor from './AddDoctor';
import RegisterPatient from './RegisterPatient';
import './App.css';


function Layout({ children }) {
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App" style={{ display: 'flex' }}>
      {!hideSidebar && <Sidebar />}
      <div className="main-content" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Medicines />} />
            <Route path="/register-product" element={<ProductRegister />} />
            <Route path="/entradas" element={<Entries />} />
            <Route path="/salidas" element={<Exits />} />
            <Route path="/alertas" element={<Alerts />} />
            <Route path="/reportes" element={<Reports />} />
            <Route path="/configuracion" element={<Settings />} />
            
           
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/register-patient" element={<RegisterPatient />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
