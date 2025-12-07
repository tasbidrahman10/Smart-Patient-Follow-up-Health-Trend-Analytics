const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');
const db = require('../config/database'); // Import database

// ============================================
// PUBLIC ROUTES (No authentication needed)
// ============================================

// Get all patients for dropdown (NEWLY ADDED)
router.get('/', async (req, res) => {
  try {
    const [patients] = await db.query(
      'SELECT id, name, condition_type FROM patients ORDER BY name'
    );
    console.log(`âœ… Fetched ${patients.length} patients for dropdown`);
    res.json(patients);
  } catch (error) {
    console.error('âŒ Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Register new patient
router.post('/register', patientController.registerPatient);

// ============================================
// PROTECTED ROUTES (Require authentication)
// ============================================

// Get all patients with full details
router.get('/all', verifyToken, patientController.getAllPatients);

// Get single patient by ID
router.get('/:id', verifyToken, patientController.getPatientById);

// Update patient
router.put('/:id', verifyToken, patientController.updatePatient);

// Delete patient
router.delete('/:id', verifyToken, patientController.deletePatient);

// Mark follow-up as done
router.post('/mark-done', verifyToken, patientController.markFollowupDone);

// Get dashboard statistics
router.get('/stats/dashboard', verifyToken, patientController.getDashboardStats);

// Get analytics stats (add this route)
router.get('/stats/analytics', async (req, res) => {
  try {
    // Total patients
    const [totalResult] = await db.query('SELECT COUNT(*) as total FROM patients');
    const totalPatients = totalResult[0].total;

    // Follow-up stats
    const [followupStats] = await db.query(`
      SELECT 
        COUNT(*) as total_followups,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'missed' OR next_followup < CURDATE() THEN 1 ELSE 0 END) as missed
      FROM patients 
      WHERE next_followup IS NOT NULL
    `);

    const stats = followupStats[0];
    const completionRate = stats.total_followups > 0
      ? Math.round((stats.completed / stats.total_followups) * 100)
      : 0;
    const missedRate = stats.total_followups > 0
      ? Math.round((stats.missed / stats.total_followups) * 100)
      : 0;

    res.json({
      totalPatients,
      completionRate,
      missedFollowups: stats.missed || 0,
      missedRate
    });

  } catch (error) {
    console.error('âŒ Error fetching analytics stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
// Get patient dashboard HTML (calls n8n)
router.get('/patients/:id/dashboard', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.id;

    // Trigger n8n to generate dashboard
    const n8nResponse = await fetch('http://localhost:5678/webhook/patient-dashboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patient_id: patientId })
    });

    const html = await n8nResponse.text();
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('âŒ Dashboard error:', error);
    res.status(500).json({ message: 'Error loading dashboard' });
  }
});

module.exports = router;