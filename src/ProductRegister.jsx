import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductRegister = () => {
  const [product, setProduct] = useState({
    name: '', code: '', quantity: '', expiryDate: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/medicines', {
        MEDICINENAME: product.name,
        QUANTITYINSTOCK: product.quantity,
        UNITPRICE: 0, 
        EXPIRYDATE: product.expiryDate,
        SUPPLIERID: 1
      });
      toast.success('Product registered successfully!');
      setProduct({ name: '', code: '', quantity: '', expiryDate: '' });
    } catch (err) {
      toast.error('Registration failed!');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '30px', borderRadius: '15px', color: '#fff', maxWidth: '800px', margin: '20px auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Register New Product</h2>
      <form onSubmit={handleRegister}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <input className="input-field" placeholder="Product Name" onChange={(e) => setProduct({...product, name: e.target.value})} />
          <input className="input-field" placeholder="Internal Code" onChange={(e) => setProduct({...product, code: e.target.value})} />
          <input className="input-field" type="number" placeholder="Quantity" onChange={(e) => setProduct({...product, quantity: e.target.value})} />
          <input className="input-field" type="date" onChange={(e) => setProduct({...product, expiryDate: e.target.value})} />
        </div>
        
        <button type="submit" className="login-btn" style={{ width: '100%', padding: '15px', fontSize: '1rem', cursor: 'pointer' }}>
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductRegister;