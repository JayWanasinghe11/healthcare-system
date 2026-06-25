const addMedicine = async () => {
  try {
    await axios.post('http://localhost:5000/api/medicines', {
      MEDICINENAME: name,
      QUANTITYINSTOCK: qty,
      UNITPRICE: price,
      EXPIRYDATE: exp,
      SUPPLIERID: 1 
    });
    alert("Medicine Added Successfully!");
  } catch (err) {
    alert("Failed to add medicine");
  }
};