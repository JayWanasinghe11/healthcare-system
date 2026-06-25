const express = require('express');
const cors = require('cors');
require('dotenv').config();
const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;

// 1. Medicine API
app.get('/api/medicines', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM Medicine`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    res.json(result.rows);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Database connection failed: " + err.message);
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 2. Dashboard Widgets  API 
app.get('/api/dashboard/stats', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    // Inventory Stats
    const invResult = await connection.execute(`
      SELECT 
        SUM(QuantityInStock) as TOTAL_STOCK,
        COUNT(*) as URGENT_ALERTS
      FROM Medicine WHERE ExpiryDate <= ADD_MONTHS(SYSDATE, 6)
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    // Doctor & Patient Stats 
    const docResult = await connection.execute("SELECT COUNT(*) as DOCTOR_COUNT FROM SYSTEM.DOCTOR");
    const patResult = await connection.execute("SELECT COUNT(*) as PATIENT_COUNT FROM SYSTEM.PATIENT");
    
   
    const invData = invResult.rows[0] || { TOTAL_STOCK: 0, URGENT_ALERTS: 0 };
    
    res.json({
      TOTAL_STOCK: invData.TOTAL_STOCK || 0,
      URGENT_ALERTS: invData.URGENT_ALERTS || 0,
      doctors: docResult.rows[0].DOCTOR_COUNT || 0,
      patients: patResult.rows[0].PATIENT_COUNT || 0
    });
  } catch (err) { 
    console.error("Dashboard Stats Error:", err);
    res.status(500).send(err.message); 
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 3. Activity Log API
app.get('/api/activity', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`
      SELECT * FROM (
        SELECT Action as TIPO, 'Medicine Update' as PRODUCTO, 1 as CANTIDAD, 'Admin' as RESPONSABLE, LogTimestamp as FECHA, 'Completado' as ESTADO 
        FROM Audit_Log ORDER BY LogTimestamp DESC
      ) WHERE ROWNUM <= 5
    `, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) { 
    console.error("Activity API Error:", err);
    res.status(500).send(err.message); 
  } finally {
    if (connection) {
      try { await connection.close(); } catch (err) { console.error(err); }
    }
  }
});

// 4. POST Medicine
app.post('/api/medicines', async (req, res) => {
  const { MEDICINENAME, QUANTITYINSTOCK, UNITPRICE, EXPIRYDATE, SUPPLIERID } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `INSERT INTO MEDICINE (MEDICINEID, MEDICINENAME, QUANTITYINSTOCK, UNITPRICE, EXPIRYDATE, SUPPLIERID) 
                 VALUES ((SELECT NVL(MAX(MEDICINEID), 0) + 1 FROM MEDICINE), :name, :qty, :price, TO_DATE(:exp, 'YYYY-MM-DD'), :sup)`;
    await connection.execute(sql, { name: MEDICINENAME, qty: parseInt(QUANTITYINSTOCK), price: parseFloat(UNITPRICE), exp: EXPIRYDATE, sup: parseInt(SUPPLIERID) }, { autoCommit: true });
    res.status(201).send("Medicine Added!");
  } catch (err) { console.error("Insert Error:", err); res.status(500).send(err.message); }
  finally { if (connection) { try { await connection.close(); } catch (err) { console.error(err); } } }
});

// Add Doctor API Route 
app.post('/api/doctors/add', async (req, res) => {
  const { name, spec, contact } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    
    const sql = `INSERT INTO SYSTEM.DOCTOR (DOCTORID, NAME, SPECIALIZATION, CONTACTNO) 
                 VALUES ((SELECT NVL(MAX(DOCTORID), 0) + 1 FROM SYSTEM.DOCTOR), :name, :spec, :contact)`;
    await connection.execute(sql, { name, spec, contact }, { autoCommit: true });
    res.status(201).send("Doctor added successfully!");
  } catch (err) {
    console.error("Add Doctor Error:", err);
    res.status(500).send(err.message);
  } finally {
    if (connection) await connection.close();
  }
});

// GET Doctors List
app.get('/api/doctors', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT * FROM SYSTEM.DOCTOR", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

// DELETE Doctor
app.delete('/api/doctors/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`DELETE FROM SYSTEM.DOCTOR WHERE DOCTORID = :id`, [req.params.id], { autoCommit: true });
    res.status(200).send("Doctor deleted successfully!");
  } catch (err) { 
    console.error("Delete Error:", err);
    res.status(500).send(err.message); 
  }
  finally { if (connection) await connection.close(); }
});

// UPDATE Doctor
app.put('/api/doctors/:id', async (req, res) => {
  const { name, spec, contact } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`UPDATE SYSTEM.DOCTOR SET NAME=:name, SPECIALIZATION=:spec, CONTACTNO=:contact WHERE DOCTORID=:id`, 
    { name, spec, contact, id: req.params.id }, { autoCommit: true });
    res.status(200).send("Doctor updated successfully!");
  } catch (err) { 
    console.error("Update Error:", err); 
    res.status(500).send(err.message); 
  }
  finally { if (connection) await connection.close(); }
}); 

// Register Patient API Route - NIC field 
app.post('/api/register-patient', async (req, res) => {
  const { name, dob, contact, gender, nic } = req.body; 
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `INSERT INTO SYSTEM.PATIENT (PATIENTID, NAME, DOB, CONTACTNO, GENDER, NIC) 
                 VALUES ((SELECT NVL(MAX(PATIENTID), 0) + 1 FROM SYSTEM.PATIENT), :name, TO_DATE(:dob, 'YYYY-MM-DD'), :contact, :gender, :nic)`;
    
    await connection.execute(sql, { name, dob, contact, gender, nic }, { autoCommit: true });
    res.status(201).send("Patient registered successfully!");
  } catch (err) {
    console.error("Register Patient Error:", err);
    res.status(500).send(err.message);
  } finally {
    if (connection) await connection.close();
  }
});

// GET Patients List
app.get('/api/patients', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT * FROM SYSTEM.PATIENT", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

// DELETE Patient
app.delete('/api/patients/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`DELETE FROM SYSTEM.PATIENT WHERE PATIENTID = :id`, [req.params.id], { autoCommit: true });
    res.status(200).send("Patient deleted successfully!");
  } catch (err) { 
    console.error("Delete Patient Error:", err);
    res.status(500).send(err.message); 
  } finally {
    if (connection) await connection.close();
  }
});

// UPDATE Patient
app.put('/api/patients/:id', async (req, res) => {
  const { name, dob, contact, gender, nic } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE SYSTEM.PATIENT SET NAME=:name, DOB=TO_DATE(:dob, 'YYYY-MM-DD'), CONTACTNO=:contact, GENDER=:gender, NIC=:nic WHERE PATIENTID=:id`,
      { name, dob, contact, gender, nic, id: req.params.id }, 
      { autoCommit: true }
    );
    res.status(200).send("Updated successfully!");
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

// 5. Login & Register API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT EMPLOYEE_ID, EMPLOYEE_NAME, PASSWORD FROM EMPLOYEE WHERE EMPLOYEE_NAME = :username`, [username], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    if (result.rows.length === 0) return res.status(401).send("Invalid Username");
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.PASSWORD);
    if (!isMatch) return res.status(401).send("Invalid Password");
    const token = jwt.sign({ id: user.EMPLOYEE_ID }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

app.post('/api/register', async (req, res) => {
  const { username, password, fullname, role } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO EMPLOYEE (EMPLOYEE_ID, EMPLOYEE_NAME, PASSWORD, FULL_NAME, ROLE) VALUES ((SELECT NVL(MAX(EMPLOYEE_ID), 0) + 1 FROM EMPLOYEE), :name, :pass, :fullname, :role)`;
    await connection.execute(sql, { name: username, pass: hashedPassword, fullname: fullname, role: role }, { autoCommit: true });
    res.status(201).send("User Registered Successfully!");
  } catch (err) { console.error(err); res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

// 6. Alerts API
app.get('/api/alerts', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT MEDICINENAME, 'Low Stock' as TYPE, MEDICINEID as LOT 
      FROM MEDICINE WHERE QUANTITYINSTOCK < 10
      UNION ALL
      SELECT MEDICINENAME, 'Expiry Soon' as TYPE, MEDICINEID as LOT 
      FROM MEDICINE WHERE EXPIRYDATE <= ADD_MONTHS(SYSDATE, 3)
    `;
    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) { console.error("Alert API Error:", err); res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

// 7. Entries & Exits API
app.get('/api/entries', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `SELECT LogTimestamp as DATE, Action as PRODUCT, 1 as QUANTITY, 'N/A' as LOT, 
                 'N/A' as SUPPLIER, 'Admin' as RESPONSIBLE, 'Completed' as STATUS 
                 FROM Audit_Log WHERE Action = 'Entry'`;
    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

app.get('/api/exits', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `SELECT LogTimestamp as DATE, Action as PRODUCT, 1 as QUANTITY, 'Urgencias' as AREA, 
                 'Admin' as RESPONSIBLE, 'Clinical Use' as REASON, 'Completed' as STATUS 
                 FROM Audit_Log WHERE Action = 'Exit'`;
    const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

// 8. Delete & Update
app.delete('/api/medicines/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`DELETE FROM MEDICINE WHERE MEDICINEID = :id`, [req.params.id], { autoCommit: true });
    res.status(200).send("Deleted");
  } catch (err) { console.error("Delete Error:", err); res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

app.put('/api/medicines/:id', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`UPDATE MEDICINE SET QUANTITYINSTOCK = :qty WHERE MEDICINEID = :id`, [req.body.QUANTITYINSTOCK, req.params.id], { autoCommit: true });
    res.status(200).send("Updated");
  } catch (err) { res.status(500).send(err.message); }
  finally { if (connection) await connection.close(); }
});

app.get('/', (req, res) => res.send("Healthcare Inventory API is running..."));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));