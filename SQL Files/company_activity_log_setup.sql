-- ============================================
-- COMPANY ACTIVITY LOG SYSTEM
-- ============================================
-- This script creates the company_activity_log table and triggers
-- to automatically track changes to company-related tables
-- Created: 2025-12-12
-- ============================================

-- Step 1: Create the activity log table
-- ============================================
CREATE TABLE IF NOT EXISTS company_activity_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    action_type ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    table_affected VARCHAR(100) NOT NULL,
    record_id INT NULL,
    field_name VARCHAR(100) NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    action_description TEXT NULL COMMENT 'Human-readable description of the action',
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    
    INDEX idx_company_id (company_id),
    INDEX idx_action_timestamp (action_timestamp),
    INDEX idx_table_affected (table_affected),
    
    FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE company_activity_log COMMENT = 'Activity log tracking all company-related changes';

-- ============================================
-- Step 2: Create UPDATE triggers for Company table
-- ============================================

DELIMITER $$

DROP TRIGGER IF EXISTS company_after_update$$
CREATE TRIGGER company_after_update
AFTER UPDATE ON Company
FOR EACH ROW
BEGIN
    -- Track company_name changes
    IF OLD.company_name != NEW.company_name THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id, 
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Company', NEW.company_id,
            'company_name', OLD.company_name, NEW.company_name,
            CONCAT('Company name changed from "', OLD.company_name, '" to "', NEW.company_name, '"')
        );
    END IF;
    
    -- Track phone_number changes
    IF OLD.phone_number != NEW.phone_number OR (OLD.phone_number IS NULL AND NEW.phone_number IS NOT NULL) OR (OLD.phone_number IS NOT NULL AND NEW.phone_number IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Company', NEW.company_id,
            'phone_number', COALESCE(OLD.phone_number, 'NULL'), COALESCE(NEW.phone_number, 'NULL'),
            'Phone number updated'
        );
    END IF;
    
    -- Track company_type changes
    IF OLD.company_type != NEW.company_type OR (OLD.company_type IS NULL AND NEW.company_type IS NOT NULL) OR (OLD.company_type IS NOT NULL AND NEW.company_type IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Company', NEW.company_id,
            'company_type', COALESCE(OLD.company_type, 'NULL'), COALESCE(NEW.company_type, 'NULL'),
            'Company type updated'
        );
    END IF;
    
    -- Track industry changes
    IF OLD.industry != NEW.industry OR (OLD.industry IS NULL AND NEW.industry IS NOT NULL) OR (OLD.industry IS NOT NULL AND NEW.industry IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Company', NEW.company_id,
            'industry', COALESCE(OLD.industry, 'NULL'), COALESCE(NEW.industry, 'NULL'),
            'Industry updated'
        );
    END IF;
    
    -- Track address changes
    IF OLD.address != NEW.address OR (OLD.address IS NULL AND NEW.address IS NOT NULL) OR (OLD.address IS NOT NULL AND NEW.address IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Company', NEW.company_id,
            'address', COALESCE(OLD.address, 'NULL'), COALESCE(NEW.address, 'NULL'),
            'Address updated'
        );
    END IF;
END$$

-- ============================================
-- Step 3: Create triggers for Job_Posts table
-- ============================================

DROP TRIGGER IF EXISTS job_posts_after_insert$$
CREATE TRIGGER job_posts_after_insert
AFTER INSERT ON Job_Posts
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (
        company_id, action_type, table_affected, record_id,
        action_description
    ) VALUES (
        NEW.company_id, 'CREATE', 'Job_Posts', NEW.post_id,
        CONCAT('New job post created (ID: ', NEW.post_id, ')')
    );
END$$

DROP TRIGGER IF EXISTS job_posts_after_update$$
CREATE TRIGGER job_posts_after_update
AFTER UPDATE ON Job_Posts
FOR EACH ROW
BEGIN
    -- Track status changes
    IF OLD.status != NEW.status THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Job_Posts', NEW.post_id,
            'status', OLD.status, NEW.status,
            CONCAT('Job post status changed from "', OLD.status, '" to "', NEW.status, '"')
        );
    END IF;
    
    -- Track applicant_limit changes
    IF OLD.applicant_limit != NEW.applicant_limit OR (OLD.applicant_limit IS NULL AND NEW.applicant_limit IS NOT NULL) OR (OLD.applicant_limit IS NOT NULL AND NEW.applicant_limit IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            NEW.company_id, 'UPDATE', 'Job_Posts', NEW.post_id,
            'applicant_limit', COALESCE(OLD.applicant_limit, 'NULL'), COALESCE(NEW.applicant_limit, 'NULL'),
            'Applicant limit updated'
        );
    END IF;
END$$

DROP TRIGGER IF EXISTS job_posts_after_delete$$
CREATE TRIGGER job_posts_after_delete
AFTER DELETE ON Job_Posts
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (
        company_id, action_type, table_affected, record_id,
        action_description
    ) VALUES (
        OLD.company_id, 'DELETE', 'Job_Posts', OLD.post_id,
        CONCAT('Job post deleted (ID: ', OLD.post_id, ')')
    );
END$$

-- ============================================
-- Step 4: Create triggers for Job_Details table
-- ============================================

DROP TRIGGER IF EXISTS job_details_after_update$$
CREATE TRIGGER job_details_after_update
AFTER UPDATE ON Job_Details
FOR EACH ROW
BEGIN
    DECLARE v_company_id INT;
    
    -- Get company_id from Job_Posts table
    SELECT company_id INTO v_company_id FROM Job_Posts WHERE post_id = NEW.post_id LIMIT 1;
    
    -- Track title changes
    IF OLD.title != NEW.title THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            v_company_id, 'UPDATE', 'Job_Details', NEW.post_id,
            'title', OLD.title, NEW.title,
            CONCAT('Job title changed from "', OLD.title, '" to "', NEW.title, '"')
        );
    END IF;
    
    -- Track work_type changes
    IF OLD.work_type != NEW.work_type THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            v_company_id, 'UPDATE', 'Job_Details', NEW.post_id,
            'work_type', OLD.work_type, NEW.work_type,
            'Work type updated'
        );
    END IF;
    
    -- Track category changes
    IF OLD.category != NEW.category OR (OLD.category IS NULL AND NEW.category IS NOT NULL) OR (OLD.category IS NOT NULL AND NEW.category IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            v_company_id, 'UPDATE', 'Job_Details', NEW.post_id,
            'category', COALESCE(OLD.category, 'NULL'), COALESCE(NEW.category, 'NULL'),
            'Job category updated'
        );
    END IF;
    
    -- Track location changes (province/city)
    IF OLD.province != NEW.province OR (OLD.province IS NULL AND NEW.province IS NOT NULL) OR (OLD.province IS NOT NULL AND NEW.province IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            v_company_id, 'UPDATE', 'Job_Details', NEW.post_id,
            'province', COALESCE(OLD.province, 'NULL'), COALESCE(NEW.province, 'NULL'),
            'Job location (province) updated'
        );
    END IF;
    
    IF OLD.city != NEW.city OR (OLD.city IS NULL AND NEW.city IS NOT NULL) OR (OLD.city IS NOT NULL AND NEW.city IS NULL) THEN
        INSERT INTO company_activity_log (
            company_id, action_type, table_affected, record_id,
            field_name, old_value, new_value, action_description
        ) VALUES (
            v_company_id, 'UPDATE', 'Job_Details', NEW.post_id,
            'city', COALESCE(OLD.city, 'NULL'), COALESCE(NEW.city, 'NULL'),
            'Job location (city) updated'
        );
    END IF;
END$$

DELIMITER ;

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify the triggers were created:
-- SHOW TRIGGERS WHERE `Table` = 'Company';
-- SHOW TRIGGERS WHERE `Table` = 'Job_Posts';
-- SHOW TRIGGERS WHERE `Table` = 'Job_Details';

-- Test query to see recent logs:
-- SELECT * FROM company_activity_log ORDER BY action_timestamp DESC LIMIT 10;
