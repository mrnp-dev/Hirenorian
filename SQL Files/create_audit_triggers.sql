-- Database Triggers for Automatic Audit Logging
-- This file contains triggers that automatically log all CRUD operations
-- on student profile-related tables to the StudentProfileAuditLog table
-- Created: 2025-12-11

-- NOTE: Run create_audit_log_table.sql FIRST before creating these triggers

DELIMITER $$

-- ============================================================================
-- TRIGGERS FOR Students TABLE (Personal Info & Contact)
-- ============================================================================

-- Trigger: Log updates to Students table
DROP TRIGGER IF EXISTS students_after_update$$
CREATE TRIGGER students_after_update
AFTER UPDATE ON Students
FOR EACH ROW
BEGIN
    -- Track first_name changes
    IF OLD.first_name != NEW.first_name THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'first_name', OLD.first_name, NEW.first_name, NULL);
    END IF;
    
    -- Track last_name changes
    IF OLD.last_name != NEW.last_name THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'last_name', OLD.last_name, NEW.last_name, NULL);
    END IF;
    
    -- Track middle_initial changes
    IF (OLD.middle_initial IS NULL AND NEW.middle_initial IS NOT NULL) 
       OR (OLD.middle_initial IS NOT NULL AND NEW.middle_initial IS NULL)
       OR (OLD.middle_initial != NEW.middle_initial) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'middle_initial', OLD.middle_initial, NEW.middle_initial, NULL);
    END IF;
    
    -- Track suffix changes
    IF (OLD.suffix IS NULL AND NEW.suffix IS NOT NULL) 
       OR (OLD.suffix IS NOT NULL AND NEW.suffix IS NULL)
       OR (OLD.suffix != NEW.suffix) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'suffix', OLD.suffix, NEW.suffix, NULL);
    END IF;
    
    -- Track personal_email changes
    IF OLD.personal_email != NEW.personal_email THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'personal_email', OLD.personal_email, NEW.personal_email, NULL);
    END IF;
    
    -- Track phone_number changes
    IF (OLD.phone_number IS NULL AND NEW.phone_number IS NOT NULL) 
       OR (OLD.phone_number IS NOT NULL AND NEW.phone_number IS NULL)
       OR (OLD.phone_number != NEW.phone_number) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'phone_number', OLD.phone_number, NEW.phone_number, NULL);
    END IF;
    
    -- Track password_hash changes (redacted for security)
    IF OLD.password_hash != NEW.password_hash THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'Students', 'password_hash', '[REDACTED]', '[REDACTED]', NULL);
    END IF;
END$$


-- ============================================================================
-- TRIGGERS FOR StudentProfile TABLE (Location, About Me, Profile Picture)
-- ============================================================================

-- Trigger: Log updates to StudentProfile table
DROP TRIGGER IF EXISTS student_profile_after_update$$
CREATE TRIGGER student_profile_after_update
AFTER UPDATE ON StudentProfile
FOR EACH ROW
BEGIN
    -- Track location changes
    IF (OLD.location IS NULL AND NEW.location IS NOT NULL) 
       OR (OLD.location IS NOT NULL AND NEW.location IS NULL)
       OR (OLD.location != NEW.location) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentProfile', 'location', OLD.location, NEW.location, NULL);
    END IF;
    
    -- Track about_me changes
    IF (OLD.about_me IS NULL AND NEW.about_me IS NOT NULL) 
       OR (OLD.about_me IS NOT NULL AND NEW.about_me IS NULL)
       OR (OLD.about_me != NEW.about_me) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentProfile', 'about_me', OLD.about_me, NEW.about_me, NULL);
    END IF;
    
    -- Track profile_picture changes
    IF (OLD.profile_picture IS NULL AND NEW.profile_picture IS NOT NULL) 
       OR (OLD.profile_picture IS NOT NULL AND NEW.profile_picture IS NULL)
       OR (OLD.profile_picture != NEW.profile_picture) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentProfile', 'profile_picture', OLD.profile_picture, NEW.profile_picture, NULL);
    END IF;
END$$


-- ============================================================================
-- TRIGGERS FOR StudentSkills TABLE (Skills CRUD)
-- ============================================================================

-- Trigger: Log skill creation
DROP TRIGGER IF EXISTS student_skills_after_insert$$
CREATE TRIGGER student_skills_after_insert
AFTER INSERT ON StudentSkills
FOR EACH ROW
BEGIN
    INSERT INTO StudentProfileAuditLog 
        (student_id, action_type, table_affected, record_id, field_name, new_value, ip_address)
    VALUES 
        (NEW.student_id, 'CREATE', 'StudentSkills', NEW.skill_id, 'skill_name', 
         CONCAT(NEW.skill_name, ' (', NEW.skill_category, ')'), NULL);
END$$

-- Trigger: Log skill deletion
DROP TRIGGER IF EXISTS student_skills_after_delete$$
CREATE TRIGGER student_skills_after_delete
AFTER DELETE ON StudentSkills
FOR EACH ROW
BEGIN
    INSERT INTO StudentProfileAuditLog 
        (student_id, action_type, table_affected, record_id, field_name, old_value, ip_address)
    VALUES 
        (OLD.student_id, 'DELETE', 'StudentSkills', OLD.skill_id, 'skill_name', 
         CONCAT(OLD.skill_name, ' (', OLD.skill_category, ')'), NULL);
END$$


-- ============================================================================
-- TRIGGERS FOR StudentEducationHistory TABLE (Education CRUD)
-- ============================================================================

-- Trigger: Log education history creation
DROP TRIGGER IF EXISTS student_edu_hist_after_insert$$
CREATE TRIGGER student_edu_hist_after_insert
AFTER INSERT ON StudentEducationHistory
FOR EACH ROW
BEGIN
    INSERT INTO StudentProfileAuditLog 
        (student_id, action_type, table_affected, record_id, new_value, ip_address)
    VALUES 
        (NEW.student_id, 'CREATE', 'StudentEducationHistory', NEW.edu_hist_id,
         JSON_OBJECT(
             'degree', NEW.degree,
             'institution', NEW.institution,
             'start_year', NEW.start_year,
             'end_year', NEW.end_year
         ), NULL);
END$$

-- Trigger: Log education history updates
DROP TRIGGER IF EXISTS student_edu_hist_after_update$$
CREATE TRIGGER student_edu_hist_after_update
AFTER UPDATE ON StudentEducationHistory
FOR EACH ROW
BEGIN
    -- Track degree changes
    IF OLD.degree != NEW.degree THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentEducationHistory', NEW.edu_hist_id, 
             'degree', OLD.degree, NEW.degree, NULL);
    END IF;
    
    -- Track institution changes
    IF OLD.institution != NEW.institution THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentEducationHistory', NEW.edu_hist_id, 
             'institution', OLD.institution, NEW.institution, NULL);
    END IF;
    
    -- Track start_year changes
    IF (OLD.start_year IS NULL AND NEW.start_year IS NOT NULL) 
       OR (OLD.start_year IS NOT NULL AND NEW.start_year IS NULL)
       OR (OLD.start_year != NEW.start_year) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentEducationHistory', NEW.edu_hist_id, 
             'start_year', OLD.start_year, NEW.start_year, NULL);
    END IF;
    
    -- Track end_year changes
    IF (OLD.end_year IS NULL AND NEW.end_year IS NOT NULL) 
       OR (OLD.end_year IS NOT NULL AND NEW.end_year IS NULL)
       OR (OLD.end_year != NEW.end_year) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentEducationHistory', NEW.edu_hist_id, 
             'end_year', OLD.end_year, NEW.end_year, NULL);
    END IF;
END$$

-- Trigger: Log education history deletion
DROP TRIGGER IF EXISTS student_edu_hist_after_delete$$
CREATE TRIGGER student_edu_hist_after_delete
AFTER DELETE ON StudentEducationHistory
FOR EACH ROW
BEGIN
    INSERT INTO StudentProfileAuditLog 
        (student_id, action_type, table_affected, record_id, old_value, ip_address)
    VALUES 
        (OLD.student_id, 'DELETE', 'StudentEducationHistory', OLD.edu_hist_id,
         JSON_OBJECT(
             'degree', OLD.degree,
             'institution', OLD.institution,
             'start_year', OLD.start_year,
             'end_year', OLD.end_year
         ), NULL);
END$$


-- ============================================================================
-- TRIGGERS FOR StudentExperience TABLE (Experience CRUD)
-- ============================================================================

-- Trigger: Log experience creation
DROP TRIGGER IF EXISTS student_exp_after_insert$$
CREATE TRIGGER student_exp_after_insert
AFTER INSERT ON StudentExperience
FOR EACH ROW
BEGIN
    INSERT INTO StudentProfileAuditLog 
        (student_id, action_type, table_affected, record_id, new_value, ip_address)
    VALUES 
        (NEW.student_id, 'CREATE', 'StudentExperience', NEW.exp_id,
         JSON_OBJECT(
             'job_title', NEW.job_title,
             'company_name', NEW.company_name,
             'start_date', NEW.start_date,
             'end_date', NEW.end_date,
             'description', NEW.description
         ), NULL);
END$$

-- Trigger: Log experience updates
DROP TRIGGER IF EXISTS student_exp_after_update$$
CREATE TRIGGER student_exp_after_update
AFTER UPDATE ON StudentExperience
FOR EACH ROW
BEGIN
    -- Track job_title changes
    IF OLD.job_title != NEW.job_title THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentExperience', NEW.exp_id, 
             'job_title', OLD.job_title, NEW.job_title, NULL);
    END IF;
    
    -- Track company_name changes
    IF OLD.company_name != NEW.company_name THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentExperience', NEW.exp_id, 
             'company_name', OLD.company_name, NEW.company_name, NULL);
    END IF;
    
    -- Track start_date changes
    IF (OLD.start_date IS NULL AND NEW.start_date IS NOT NULL) 
       OR (OLD.start_date IS NOT NULL AND NEW.start_date IS NULL)
       OR (OLD.start_date != NEW.start_date) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentExperience', NEW.exp_id, 
             'start_date', OLD.start_date, NEW.start_date, NULL);
    END IF;
    
    -- Track end_date changes
    IF (OLD.end_date IS NULL AND NEW.end_date IS NOT NULL) 
       OR (OLD.end_date IS NOT NULL AND NEW.end_date IS NULL)
       OR (OLD.end_date != NEW.end_date) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentExperience', NEW.exp_id, 
             'end_date', OLD.end_date, NEW.end_date, NULL);
    END IF;
    
    -- Track description changes
    IF (OLD.description IS NULL AND NEW.description IS NOT NULL) 
       OR (OLD.description IS NOT NULL AND NEW.description IS NULL)
       OR (OLD.description != NEW.description) THEN
        INSERT INTO StudentProfileAuditLog 
            (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
        VALUES 
            (NEW.student_id, 'UPDATE', 'StudentExperience', NEW.exp_id, 
             'description', OLD.description, NEW.description, NULL);
    END IF;
END$$

-- Trigger: Log experience deletion
DROP TRIGGER IF EXISTS student_exp_after_delete$$
CREATE TRIGGER student_exp_after_delete
AFTER DELETE ON StudentExperience
FOR EACH ROW
BEGIN
    INSERT INTO StudentProfileAuditLog 
        (student_id, action_type, table_affected, record_id, old_value, ip_address)
    VALUES 
        (OLD.student_id, 'DELETE', 'StudentExperience', OLD.exp_id,
         JSON_OBJECT(
             'job_title', OLD.job_title,
             'company_name', OLD.company_name,
             'start_date', OLD.start_date,
             'end_date', OLD.end_date,
             'description', OLD.description
         ), NULL);
END$$

DELIMITER ;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show all triggers created
SHOW TRIGGERS WHERE `Trigger` LIKE 'student%';

-- Count triggers per table
SELECT TRIGGER_SCHEMA, EVENT_OBJECT_TABLE, COUNT(*) as trigger_count
FROM information_schema.TRIGGERS
WHERE TRIGGER_SCHEMA = DATABASE() AND EVENT_OBJECT_TABLE IN 
    ('Students', 'StudentProfile', 'StudentSkills', 'StudentEducationHistory', 'StudentExperience')
GROUP BY TRIGGER_SCHEMA, EVENT_OBJECT_TABLE;
