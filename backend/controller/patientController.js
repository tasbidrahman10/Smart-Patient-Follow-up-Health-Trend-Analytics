const db = require('../config/database');

// Register New Patient - FIXED for no authentication
exports.registerPatient = async (req, res) => {
  const {
    name,
    age,
    gender,
    contact,
    mail,
    condition_type,  // FIXED: Match database column
    length_of_stay,
    outcome,
    glucose,
    insulin,
    bmi,
    diabetes,
    heart_rate,
    systolic_bp,
    diastolic_bp,
    blood_sugar,
    ck_mb,
    troponin,
    visit_date,
    next_followup,
    assigned_doctor
  } = req.body;

  try {
    // Validate required fields
    if (!name || !age || !gender || !contact || !condition_type || !visit_date || !next_followup) {
      return res.status(400).json({
        message: 'Required fields: name, age, gender, contact, condition_type, visit_date, next_followup'
      });
    }

    // FIXED: Default user_id to 1 for testing (since no authentication)
    const userId = 1;

    // Calculate status
    const today = new Date();
    const followupDate = new Date(next_followup);
    const diffDays = Math.ceil((followupDate - today) / (1000 * 60 * 60 * 24));

    let status = 'Scheduled';
    if (diffDays < 0) status = 'Overdue';
    else if (diffDays === 0) status = 'Today';
    else if (diffDays <= 7) status = 'Pending';

    // Insert patient
    const [result] = await db.query(
      `INSERT INTO patients 
       (user_id, name, age, gender, contact, mail, condition_type,
        length_of_stay, outcome, glucose, insulin, bmi, diabetes,
        heart_rate, systolic_bp, diastolic_bp, blood_sugar, ck_mb, troponin,
        visit_date, next_followup, assigned_doctor, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, age, gender, contact, mail, condition_type,
        length_of_stay, outcome, glucose, insulin, bmi, diabetes,
        heart_rate, systolic_bp, diastolic_bp, blood_sugar, ck_mb, troponin,
        visit_date, next_followup, assigned_doctor, status]
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      patientId: result.insertId
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({ message: 'Error registering patient', error: error.message });
  }
};

// Get All Patients
exports.getAllPatients = async (req, res) => {
  try {
    const userId = req.user?.userId || 1; // Default to 1 if no auth

    const [patients] = await db.query(
      `SELECT id, name, age, gender, contact, mail, condition_type as conditionType,
              length_of_stay as lengthOfStay, outcome,
              glucose, insulin, bmi, diabetes,
              heart_rate as heartRate, systolic_bp as systolicBp,
              diastolic_bp as diastolicBp, blood_sugar as bloodSugar,
              ck_mb as ckMb, troponin,
              visit_date as visitDate, next_followup as nextFollowup,
              assigned_doctor as doctor, status, created_at
       FROM patients
       WHERE user_id = ?
       ORDER BY next_followup ASC`,
      [userId]
    );

    res.status(200).json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
};

// Get Single Patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const userId = req.user?.userId || 1;
    const patientId = req.params.id;

    const [patients] = await db.query(
      `SELECT * FROM patients WHERE id = ? AND user_id = ?`,
      [patientId, userId]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ patient: patients[0] });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Error fetching patient' });
  }
};

// Update Patient
exports.updatePatient = async (req, res) => {
  const patientId = req.params.id;
  const userId = req.user?.userId || 1;
  const updates = req.body;

  try {
    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'id' && key !== 'user_id') {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(patientId, userId);

    const [result] = await db.query(
      `UPDATE patients SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Error updating patient' });
  }
};

// Delete Patient
exports.deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;
    const userId = req.user?.userId || 1;

    const [result] = await db.query(
      'DELETE FROM patients WHERE id = ? AND user_id = ?',
      [patientId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Error deleting patient' });
  }
};

// Mark Follow-up Done
exports.markFollowupDone = async (req, res) => {
  try {
    const patientId = req.body.patientId;
    const userId = req.user?.userId || 1;

    const [result] = await db.query(
      `UPDATE patients SET status = 'Completed' WHERE id = ? AND user_id = ?`,
      [patientId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ message: 'Follow-up marked as completed' });
  } catch (error) {
    console.error('Mark followup error:', error);
    res.status(500).json({ message: 'Error updating follow-up status' });
  }
};

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user?.userId || 1;
    const today = new Date().toISOString().split('T')[0];

    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM patients WHERE user_id = ?',
      [userId]
    );

    const [pendingResult] = await db.query(
      `SELECT COUNT(*) as pending FROM patients
       WHERE user_id = ?
       AND next_followup > ?
       AND next_followup <= DATE_ADD(?, INTERVAL 7 DAY)
       AND status != 'Completed'`,
      [userId, today, today]
    );

    const [completedResult] = await db.query(
      `SELECT COUNT(*) as completed FROM patients
       WHERE user_id = ?
       AND status = 'Completed'
       AND DATE(updated_at) = ?`,
      [userId, today]
    );

    const [missedResult] = await db.query(
      `SELECT COUNT(*) as missed FROM patients
       WHERE user_id = ?
       AND next_followup < ?
       AND status != 'Completed'`,
      [userId, today]
    );

    res.status(200).json({
      totalPatients: totalResult[0].total,
      pendingFollowUps: pendingResult[0].pending,
      completedToday: completedResult[0].completed,
      missedFollowUps: missedResult[0].missed
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};