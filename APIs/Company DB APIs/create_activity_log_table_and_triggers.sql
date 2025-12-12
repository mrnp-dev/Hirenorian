-- ============================================================================
-- Company Activity Log Table and Triggers
-- ============================================================================
-- This file creates the company_activity_log table and all necessary triggers
-- to track all company-related actions automatically.
-- ============================================================================

-- Create the Activity Log Table
CREATE TABLE IF NOT EXISTS company_activity_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    action_type ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    table_affected VARCHAR(100) NOT NULL,
    record_id INT NULL,
    field_name VARCHAR(100) NULL,
    old_value TEXT NULL,
    new_value TEXT NULL,
    action_description VARCHAR(500) NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE,
    INDEX idx_company_timestamp (company_id, action_timestamp DESC),
    INDEX idx_table_affected (table_affected)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- COMPANY TABLE TRIGGERS
-- ============================================================================

DELIMITER $$

-- Company: After Update - Track profile changes
CREATE TRIGGER trg_company_after_update
AFTER UPDATE ON Company
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    
    -- Track company name changes
    IF OLD.company_name != NEW.company_name THEN
        SET description = CONCAT('Changed company name from "', OLD.company_name, '" to "', NEW.company_name, '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'company_name', OLD.company_name, NEW.company_name, description);
    END IF;
    
    -- Track email changes
    IF OLD.email != NEW.email THEN
        SET description = CONCAT('Changed company email from "', OLD.email, '" to "', NEW.email, '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'email', OLD.email, NEW.email, description);
    END IF;
    
    -- Track phone number changes
    IF (OLD.phone_number IS NULL AND NEW.phone_number IS NOT NULL) OR 
       (OLD.phone_number IS NOT NULL AND NEW.phone_number IS NULL) OR
       (OLD.phone_number != NEW.phone_number) THEN
        SET description = CONCAT('Changed phone number from "', IFNULL(OLD.phone_number, 'N/A'), '" to "', IFNULL(NEW.phone_number, 'N/A'), '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'phone_number', OLD.phone_number, NEW.phone_number, description);
    END IF;
    
    -- Track company type changes
    IF (OLD.company_type IS NULL AND NEW.company_type IS NOT NULL) OR 
       (OLD.company_type IS NOT NULL AND NEW.company_type IS NULL) OR
       (OLD.company_type != NEW.company_type) THEN
        SET description = CONCAT('Changed company type from "', IFNULL(OLD.company_type, 'N/A'), '" to "', IFNULL(NEW.company_type, 'N/A'), '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'company_type', OLD.company_type, NEW.company_type, description);
    END IF;
    
    -- Track industry changes
    IF (OLD.industry IS NULL AND NEW.industry IS NOT NULL) OR 
       (OLD.industry IS NOT NULL AND NEW.industry IS NULL) OR
       (OLD.industry != NEW.industry) THEN
        SET description = CONCAT('Changed industry from "', IFNULL(OLD.industry, 'N/A'), '" to "', IFNULL(NEW.industry, 'N/A'), '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'industry', OLD.industry, NEW.industry, description);
    END IF;
    
    -- Track address changes
    IF (OLD.address IS NULL AND NEW.address IS NOT NULL) OR 
       (OLD.address IS NOT NULL AND NEW.address IS NULL) OR
       (OLD.address != NEW.address) THEN
        SET description = 'Updated company address';
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'address', OLD.address, NEW.address, description);
    END IF;
    
    -- Track password changes (without storing actual password)
    IF OLD.password_hash != NEW.password_hash THEN
        SET description = 'Changed account password';
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'password_hash', '***', '***', description);
    END IF;
    
    -- Track verification status changes
    IF OLD.verification != NEW.verification THEN
        SET description = CONCAT('Verification status changed to "', NEW.verification, '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'verification', OLD.verification, NEW.verification, description);
    END IF;
    
    -- Track activation status changes
    IF (OLD.activation IS NULL AND NEW.activation IS NOT NULL) OR 
       (OLD.activation IS NOT NULL AND NEW.activation IS NULL) OR
       (OLD.activation != NEW.activation) THEN
        SET description = CONCAT('Account activation status changed to "', NEW.activation, '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company', NEW.company_id, 'activation', OLD.activation, NEW.activation, description);
    END IF;
END$$

-- ============================================================================
-- COMPANY ADDITIONAL INFORMATION TRIGGERS
-- ============================================================================

-- Company Additional Info: After Insert
CREATE TRIGGER trg_company_additional_info_after_insert
AFTER INSERT ON company_additional_informations
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'company_additional_informations', NEW.company_add_id, 'Added company additional information');
END$$

-- Company Additional Info: After Update
CREATE TRIGGER trg_company_additional_info_after_update
AFTER UPDATE ON company_additional_informations
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    
    -- Track about_us changes
    IF (OLD.about_us IS NULL AND NEW.about_us IS NOT NULL) OR 
       (OLD.about_us IS NOT NULL AND NEW.about_us IS NULL) OR
       (OLD.about_us != NEW.about_us) THEN
        SET description = 'Updated "About Us" section';
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'company_additional_informations', NEW.company_add_id, 'about_us', description);
    END IF;
    
    -- Track why_join_us changes
    IF (OLD.why_join_us IS NULL AND NEW.why_join_us IS NOT NULL) OR 
       (OLD.why_join_us IS NOT NULL AND NEW.why_join_us IS NULL) OR
       (OLD.why_join_us != NEW.why_join_us) THEN
        SET description = 'Updated "Why Join Us" section';
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'company_additional_informations', NEW.company_add_id, 'why_join_us', description);
    END IF;
    
    -- Track website_link changes
    IF (OLD.website_link IS NULL AND NEW.website_link IS NOT NULL) OR 
       (OLD.website_link IS NOT NULL AND NEW.website_link IS NULL) OR
       (OLD.website_link != NEW.website_link) THEN
        SET description = CONCAT('Updated website link to "', IFNULL(NEW.website_link, 'N/A'), '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'company_additional_informations', NEW.company_add_id, 'website_link', NEW.website_link, description);
    END IF;
    
    -- Track tagline changes
    IF (OLD.tagline IS NULL AND NEW.tagline IS NOT NULL) OR 
       (OLD.tagline IS NOT NULL AND NEW.tagline IS NULL) OR
       (OLD.tagline != NEW.tagline) THEN
        SET description = CONCAT('Updated tagline to "', IFNULL(NEW.tagline, 'N/A'), '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'company_additional_informations', NEW.company_add_id, 'tagline', NEW.tagline, description);
    END IF;
END$$

-- ============================================================================
-- COMPANY CONTACT PERSONS TRIGGERS
-- ============================================================================

-- Contact Persons: After Insert
CREATE TRIGGER trg_company_contact_after_insert
AFTER INSERT ON company_contact_persons
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Added contact person: ', IFNULL(NEW.contact_name, 'Unnamed'), ' (', IFNULL(NEW.position, 'No position'), ')');
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'company_contact_persons', NEW.contact_person_id, description);
END$$

-- Contact Persons: After Update
CREATE TRIGGER trg_company_contact_after_update
AFTER UPDATE ON company_contact_persons
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Updated contact person: ', IFNULL(NEW.contact_name, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'UPDATE', 'company_contact_persons', NEW.contact_person_id, description);
END$$

-- Contact Persons: After Delete
CREATE TRIGGER trg_company_contact_after_delete
AFTER DELETE ON company_contact_persons
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Removed contact person: ', IFNULL(OLD.contact_name, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (OLD.company_id, 'DELETE', 'company_contact_persons', OLD.contact_person_id, description);
END$$

-- ============================================================================
-- COMPANY LOCATIONS TRIGGERS
-- ============================================================================

-- Locations: After Insert
CREATE TRIGGER trg_company_location_after_insert
AFTER INSERT ON company_locations
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Added company location: ', IFNULL(NEW.location, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'company_locations', NEW.loc_id, description);
END$$

-- Locations: After Update
CREATE TRIGGER trg_company_location_after_update
AFTER UPDATE ON company_locations
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Updated company location: ', IFNULL(NEW.location, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'UPDATE', 'company_locations', NEW.loc_id, description);
END$$

-- Locations: After Delete
CREATE TRIGGER trg_company_location_after_delete
AFTER DELETE ON company_locations
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Removed company location: ', IFNULL(OLD.location, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (OLD.company_id, 'DELETE', 'company_locations', OLD.loc_id, description);
END$$

-- ============================================================================
-- COMPANY PERKS & BENEFITS TRIGGERS
-- ============================================================================

-- Perks: After Insert
CREATE TRIGGER trg_company_perk_after_insert
AFTER INSERT ON company_perks_benefits
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Added perk/benefit: ', IFNULL(NEW.perk, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'company_perks_benefits', NEW.perk_id, description);
END$$

-- Perks: After Delete
CREATE TRIGGER trg_company_perk_after_delete
AFTER DELETE ON company_perks_benefits
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    SET description = CONCAT('Removed perk/benefit: ', IFNULL(OLD.perk, 'Unnamed'));
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (OLD.company_id, 'DELETE', 'company_perks_benefits', OLD.perk_id, description);
END$$

-- ============================================================================
-- COMPANY ICONS & BANNERS TRIGGERS
-- ============================================================================

-- Icons: After Insert
CREATE TRIGGER trg_company_icon_after_insert
AFTER INSERT ON company_icons
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'company_icons', NEW.icon_id, 'Uploaded new company icon');
END$$

-- Banners: After Insert
CREATE TRIGGER trg_company_banner_after_insert
AFTER INSERT ON company_banners
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'company_banners', NEW.banner_id, 'Uploaded new company banner');
END$$

-- ============================================================================
-- JOB POSTS TRIGGERS
-- ============================================================================

-- Job Posts: After Insert
CREATE TRIGGER trg_job_post_after_insert
AFTER INSERT ON Job_Posts
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (NEW.company_id, 'CREATE', 'Job_Posts', NEW.post_id, 'Created a new job post');
END$$

-- Job Posts: After Update
CREATE TRIGGER trg_job_post_after_update
AFTER UPDATE ON Job_Posts
FOR EACH ROW
BEGIN
    DECLARE description VARCHAR(500);
    
    -- Track status changes
    IF (OLD.status IS NULL AND NEW.status IS NOT NULL) OR 
       (OLD.status IS NOT NULL AND NEW.status IS NULL) OR
       (OLD.status != NEW.status) THEN
        SET description = CONCAT('Changed job post status to "', NEW.status, '"');
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Job_Posts', NEW.post_id, 'status', OLD.status, NEW.status, description);
    END IF;
    
    -- Track applicant limit changes
    IF (OLD.applicant_limit IS NULL AND NEW.applicant_limit IS NOT NULL) OR 
       (OLD.applicant_limit IS NOT NULL AND NEW.applicant_limit IS NULL) OR
       (OLD.applicant_limit != NEW.applicant_limit) THEN
        SET description = CONCAT('Changed applicant limit from ', IFNULL(OLD.applicant_limit, 'N/A'), ' to ', IFNULL(NEW.applicant_limit, 'N/A'));
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Job_Posts', NEW.post_id, 'applicant_limit', description);
    END IF;
END$$

-- Job Posts: After Delete
CREATE TRIGGER trg_job_post_after_delete
AFTER DELETE ON Job_Posts
FOR EACH ROW
BEGIN
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (OLD.company_id, 'DELETE', 'Job_Posts', OLD.post_id, 'Deleted a job post');
END$$

-- ============================================================================
-- JOB DETAILS TRIGGERS
-- ============================================================================

-- Job Details: After Insert
CREATE TRIGGER trg_job_details_after_insert
AFTER INSERT ON Job_Details
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;
    
    IF comp_id IS NOT NULL THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (comp_id, 'CREATE', 'Job_Details', NEW.post_id, CONCAT('Added details for job: ', IFNULL(NEW.title, 'Untitled')));
    END IF;
END$$

-- Job Details: After Update
CREATE TRIGGER trg_job_details_after_update
AFTER UPDATE ON Job_Details
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    DECLARE description VARCHAR(500);
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;
    
    IF comp_id IS NOT NULL THEN
        -- Track title changes
        IF OLD.title != NEW.title THEN
            SET description = CONCAT('Changed job title from "', OLD.title, '" to "', NEW.title, '"');
            INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
            VALUES (comp_id, 'UPDATE', 'Job_Details', NEW.post_id, 'title', description);
        END IF;
        
        -- Track location changes (Province/City)
        IF (OLD.province IS NULL AND NEW.province IS NOT NULL) OR 
           (OLD.province IS NOT NULL AND NEW.province IS NULL) OR
           (OLD.province != NEW.province) OR
           (OLD.city IS NULL AND NEW.city IS NOT NULL) OR 
           (OLD.city IS NOT NULL AND NEW.city IS NULL) OR
           (OLD.city != NEW.city) THEN
            SET description = CONCAT('Updated job location to ', IFNULL(NEW.city, ''), ', ', IFNULL(NEW.province, ''));
            INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
            VALUES (comp_id, 'UPDATE', 'Job_Details', NEW.post_id, 'location', description);
        END IF;
        
        -- Track work type changes
        IF (OLD.work_type IS NULL AND NEW.work_type IS NOT NULL) OR 
           (OLD.work_type IS NOT NULL AND NEW.work_type IS NULL) OR
           (OLD.work_type != NEW.work_type) THEN
            SET description = CONCAT('Changed work type to "', NEW.work_type, '"');
            INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
            VALUES (comp_id, 'UPDATE', 'Job_Details', NEW.post_id, 'work_type', description);
        END IF;
        
        -- Track description changes
        IF (OLD.description IS NULL AND NEW.description IS NOT NULL) OR 
           (OLD.description IS NOT NULL AND NEW.description IS NULL) OR
           (OLD.description != NEW.description) THEN
            SET description = CONCAT('Updated job description for "', NEW.title, '"');
            INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
            VALUES (comp_id, 'UPDATE', 'Job_Details', NEW.post_id, 'description', description);
        END IF;
        
        -- Track category changes
        IF (OLD.category IS NULL AND NEW.category IS NOT NULL) OR 
           (OLD.category IS NOT NULL AND NEW.category IS NULL) OR
           (OLD.category != NEW.category) THEN
            SET description = CONCAT('Changed job category to "', IFNULL(NEW.category, 'N/A'), '"');
            INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, action_description)
            VALUES (comp_id, 'UPDATE', 'Job_Details', NEW.post_id, 'category', description);
        END IF;
    END IF;
END$$

-- ============================================================================
-- JOB TAGS TRIGGERS
-- ============================================================================

-- Job Tags: After Insert
CREATE TRIGGER trg_job_tag_after_insert
AFTER INSERT ON Job_Tags
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;
    
    IF comp_id IS NOT NULL THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (comp_id, 'CREATE', 'Job_Tags', NEW.tag_id, CONCAT('Added tag "', NEW.tag, '" to job post'));
    END IF;
END$$

-- Job Tags: After Delete
CREATE TRIGGER trg_job_tag_after_delete
AFTER DELETE ON Job_Tags
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = OLD.post_id;
    
    IF comp_id IS NOT NULL THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (comp_id, 'DELETE', 'Job_Tags', OLD.tag_id, CONCAT('Removed tag "', OLD.tag, '" from job post'));
    END IF;
END$$

-- ============================================================================
-- APPLICANTS TRIGGERS
-- ============================================================================

-- Applicants: After Insert
CREATE TRIGGER trg_applicant_after_insert
AFTER INSERT ON Applicants
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;
    
    IF comp_id IS NOT NULL THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (comp_id, 'CREATE', 'Applicants', NEW.applicant_id, 'Received a new job application');
    END IF;
END$$

-- Applicants: After Update
CREATE TRIGGER trg_applicant_after_update
AFTER UPDATE ON Applicants
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    DECLARE description VARCHAR(500);
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;
    
    IF comp_id IS NOT NULL THEN
        -- Track status changes
        IF OLD.status != NEW.status THEN
            IF NEW.status = 'Accepted' THEN
                SET description = 'Accepted an applicant';
            ELSEIF NEW.status = 'Rejected' THEN
                SET description = 'Rejected an applicant';
            ELSE
                SET description = CONCAT('Changed applicant status to "', NEW.status, '"');
            END IF;
            
            INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
            VALUES (comp_id, 'UPDATE', 'Applicants', NEW.applicant_id, 'status', OLD.status, NEW.status, description);
        END IF;
    END IF;
END$$

DELIMITER ;

-- ============================================================================
-- End of SQL Script
-- ============================================================================
