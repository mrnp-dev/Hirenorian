CREATE TABLE IF NOT EXISTS OTP_Verification (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    status ENUM('valid', 'expired', 'used') DEFAULT 'valid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
