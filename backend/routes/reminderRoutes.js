const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../middleware/authMiddleware');

// Get reminder dashboard data (with status tracking)
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all reminders with patient info for this user's hospital
    const [reminders] = await db.query(`
      SELECT 
        r.id,
        r.reminder_date,
        r.status,
        r.sent_at,
        r.reminder_type,
        r.scheduled_time,
        p.id as patient_id,
        p.name as patient_name,
        p.contact,
        p.mail,
        p.condition_type,
        p.next_followup,
        p.assigned_doctor
      FROM reminders r
      INNER JOIN patients p ON r.patient_id = p.id
      WHERE p.user_id = ?
      ORDER BY r.reminder_date DESC, r.scheduled_time DESC
      LIMIT 100
    `, [userId]);

    // Get counts for each status
    const [statusCounts] = await db.query(`
      SELECT 
        r.status,
        COUNT(*) as count
      FROM reminders r
      INNER JOIN patients p ON r.patient_id = p.id
      WHERE p.user_id = ?
      GROUP BY r.status
    `, [userId]);

    // Format response
    const dashboardData = {
      reminders: reminders,
      stats: {
        total: reminders.length,
        pending: statusCounts.find(s => s.status === 'pending')?.count || 0,
        sent: statusCounts.find(s => s.status === 'sent')?.count || 0,
        failed: statusCounts.find(s => s.status === 'failed')?.count || 0,
        cancelled: statusCounts.find(s => s.status === 'cancelled')?.count || 0
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching reminder dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch reminder dashboard' });
  }
});

// Get upcoming reminders (for n8n to process)
router.get('/upcoming', async (req, res) => {
  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    // Fetch patients with follow-ups tomorrow
    const [upcomingReminders] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.contact,
        p.mail,
        p.condition_type,
        p.next_followup,
        p.assigned_doctor
      FROM patients p
      WHERE p.next_followup = ?
        AND NOT EXISTS (
          SELECT 1 FROM reminders r 
          WHERE r.patient_id = p.id 
          AND r.reminder_date = ?
          AND r.status IN ('sent', 'pending')
        )
    `, [tomorrowDate, tomorrowDate]);

    res.json(upcomingReminders);
  } catch (error) {
    console.error('Error fetching upcoming reminders:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming reminders' });
  }
});

// Create reminder record (called by n8n after processing)
router.post('/create', async (req, res) => {
  try {
    const { patient_id, reminder_type, reminder_date, scheduled_time } = req.body;

    const [result] = await db.query(`
      INSERT INTO reminders (patient_id, reminder_type, reminder_date, scheduled_time, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [patient_id, reminder_type, reminder_date, scheduled_time || '09:00:00']);

    res.json({
      message: 'Reminder created successfully',
      reminderId: result.insertId
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder' });
  }
});

// Update reminder status (called by n8n after sending)
router.put('/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, failure_reason } = req.body;

    const updateData = {
      status: status,
      sent_at: status === 'sent' ? new Date() : null,
      failure_reason: failure_reason || null
    };

    await db.query(`
      UPDATE reminders 
      SET status = ?, sent_at = ?, failure_reason = ?
      WHERE id = ?
    `, [updateData.status, updateData.sent_at, updateData.failure_reason, id]);

    // Log the update
    if (req.body.log_message) {
      await db.query(`
        INSERT INTO reminder_logs (reminder_id, log_type, log_message)
        VALUES (?, ?, ?)
      `, [id, req.body.log_type || 'email_sent', req.body.log_message]);
    }

    res.json({ message: 'Reminder status updated successfully' });
  } catch (error) {
    console.error('Error updating reminder status:', error);
    res.status(500).json({ message: 'Failed to update reminder status' });
  }
});

// Get reminder logs for a specific reminder
router.get('/logs/:reminderId', verifyToken, async (req, res) => {
  try {
    const { reminderId } = req.params;

    const [logs] = await db.query(`
      SELECT * FROM reminder_logs 
      WHERE reminder_id = ?
      ORDER BY created_at DESC
    `, [reminderId]);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching reminder logs:', error);
    res.status(500).json({ message: 'Failed to fetch reminder logs' });
  }
});

// Manual reminder trigger
router.post('/send-manual', verifyToken, async (req, res) => {
  try {
    const { patient_id, reminder_type } = req.body;

    // Trigger n8n webhook for manual reminder
    const response = await fetch('http://localhost:5678/webhook/send-manual-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id,
        reminder_type,
        triggered_by: req.user.userId
      })
    });

    if (response.ok) {
      res.json({ message: 'Manual reminder triggered successfully' });
    } else {
      throw new Error('Failed to trigger n8n webhook');
    }
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    res.status(500).json({ message: 'Failed to send manual reminder' });
  }
});

module.exports = router;
