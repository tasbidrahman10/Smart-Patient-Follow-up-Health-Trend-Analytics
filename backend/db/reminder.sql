USE smart_patient_followup;

-- Create reminders table to track all reminder activities
CREATE TABLE IF NOT EXISTS reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    reminder_type ENUM('email', 'sms', 'both') DEFAULT 'email',
    reminder_date DATE NOT NULL,
    scheduled_time TIME DEFAULT '09:00:00',
    status ENUM('pending', 'sent', 'failed', 'cancelled') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    failure_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_patient_id (patient_id),
    INDEX idx_reminder_date (reminder_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reminder_logs table for detailed tracking
CREATE TABLE IF NOT EXISTS reminder_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reminder_id INT NOT NULL,
    log_type ENUM('email_sent', 'sms_sent', 'email_failed', 'sms_failed', 'patient_confirmed') DEFAULT 'email_sent',
    log_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE CASCADE,
    INDEX idx_reminder_id (reminder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add reminder preferences to patients table if not exists
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS reminder_preference ENUM('email', 'sms', 'both', 'none') DEFAULT 'email',
ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT TRUE;

-- Verify tables creation
SELECT 'Reminder tables created successfully!' AS message;