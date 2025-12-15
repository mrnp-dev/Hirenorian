CREATE TABLE IF NOT EXISTS StudentVerificationRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    student_type ENUM('Graduate', 'Undergraduate') NOT NULL,
    tor_file VARCHAR(255) DEFAULT NULL,
    diploma_file VARCHAR(255) DEFAULT NULL,
    student_id_file VARCHAR(255) DEFAULT NULL,
    cor_file VARCHAR(255) DEFAULT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);
