USE smart_patient_followup;

USE smart_patient_followup;

-- Drop the old patients table completely
DROP TABLE IF EXISTS patients;

-- Create NEW patients table with ONLY updated columns
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    contact VARCHAR(50) NOT NULL,
    mail VARCHAR(255) DEFAULT NULL,
    condition_type VARCHAR(100) NOT NULL,
    length_of_stay INT DEFAULT NULL,
    outcome VARCHAR(100) DEFAULT NULL,
    glucose DECIMAL(6,2) DEFAULT NULL,
    insulin DECIMAL(6,2) DEFAULT NULL,
    bmi DECIMAL(5,2) DEFAULT NULL,
    diabetes BOOLEAN DEFAULT NULL,
    heart_rate INT DEFAULT NULL,
    systolic_bp INT DEFAULT NULL,
    diastolic_bp INT DEFAULT NULL,
    blood_sugar DECIMAL(6,2) DEFAULT NULL,
    ck_mb DECIMAL(8,2) DEFAULT NULL,
    troponin DECIMAL(8,4) DEFAULT NULL,
    visit_date DATE NOT NULL,
    next_followup DATE NOT NULL,
    assigned_doctor VARCHAR(255) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_next_followup (next_followup),
    INDEX idx_condition (condition_type),
    INDEX idx_outcome (outcome),
    INDEX idx_diabetes (diabetes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify new structure
DESC patients;
SELECT 'New patients table created with your exact schema!' AS message;


CREATE TABLE IF NOT EXISTS patient_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  report_html LONGTEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_patient_id (patient_id)
);
