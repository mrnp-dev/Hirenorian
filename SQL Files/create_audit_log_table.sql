-- Student Profile Audit Log Table
-- This table tracks all CRUD operations performed by students on their profile
-- Created: 2025-12-11

CREATE TABLE IF NOT EXISTS StudentProfileAuditLog (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    action_type ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    table_affected VARCHAR(100) NOT NULL,
    record_id INT NULL,
    field_name VARCHAR(100) NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    INDEX idx_student_id (student_id),
    INDEX idx_action_timestamp (action_timestamp),
    INDEX idx_table_affected (table_affected),
    
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment to table
ALTER TABLE StudentProfileAuditLog COMMENT = 'Audit log tracking all student profile edit operations';
