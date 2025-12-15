DELIMITER $$

-- 1. Modify Job Post Status Update Trigger
-- Requirement: "only the status of the specific job title... is need to be logged"
DROP TRIGGER IF EXISTS trg_job_post_after_update$$
CREATE TRIGGER trg_job_post_after_update
AFTER UPDATE ON Job_Posts
FOR EACH ROW
BEGIN
    DECLARE job_title VARCHAR(255);
    DECLARE description VARCHAR(500);

    -- Only log if status changed
    IF OLD.status != NEW.status THEN
        -- Fetch Job Title
        SELECT title INTO job_title FROM Job_Details WHERE post_id = NEW.post_id LIMIT 1;
        
        SET description = CONCAT('Changed status of job "', IFNULL(job_title, 'Untitled'), '" to "', NEW.status, '"');
        
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Job_Posts', NEW.post_id, 'status', OLD.status, NEW.status, description);
    END IF;
    
    -- (We ignore other field updates on Job_Posts for now to reduce noise, or keep them generic if needed. 
    -- The prompt specifically mentioned "don't include tags" and focused on status/title.)
END$$


-- 2. Modify Job Post Delete Trigger
-- Requirement: "job title that was deleted is need to be logged"
-- We use BEFORE DELETE to ensure Job_Details still exists
DROP TRIGGER IF EXISTS trg_job_post_after_delete$$
DROP TRIGGER IF EXISTS trg_job_post_before_delete$$

CREATE TRIGGER trg_job_post_before_delete
BEFORE DELETE ON Job_Posts
FOR EACH ROW
BEGIN
    DECLARE job_title VARCHAR(255);
    
    -- Fetch Job Title
    SELECT title INTO job_title FROM Job_Details WHERE post_id = OLD.post_id LIMIT 1;
    
    INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
    VALUES (OLD.company_id, 'DELETE', 'Job_Posts', OLD.post_id, CONCAT('Deleted job post: ', IFNULL(job_title, 'Untitled')));
END$$


-- 3. Modify Applicant Status Trigger
-- Requirement: "log ... name of the applicant ... rejected or accepted"
-- Requirement: Support disabling for bulk updates (via @disable_applicant_trigger)
DROP TRIGGER IF EXISTS trg_applicant_after_update$$
CREATE TRIGGER trg_applicant_after_update
AFTER UPDATE ON Applicants
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    DECLARE job_title VARCHAR(255);
    DECLARE applicant_name VARCHAR(255);
    DECLARE description VARCHAR(500);

    -- CHECK FOR SUPPRESSION FLAG
    IF (@disable_applicant_trigger IS NULL) THEN

        SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;
        
        IF comp_id IS NOT NULL THEN
            IF OLD.status != NEW.status THEN
                
                -- Fetch Applicant Name
                SELECT CONCAT(first_name, ' ', last_name) INTO applicant_name 
                FROM Students WHERE student_id = NEW.student_id LIMIT 1;
                
                -- Fetch Job Title (Optional but helpful context)
                SELECT title INTO job_title FROM Job_Details WHERE post_id = NEW.post_id LIMIT 1;
                
                IF NEW.status = 'Accepted' THEN
                    SET description = CONCAT('Accepted applicant ', IFNULL(applicant_name, 'Unknown'), ' for ', IFNULL(job_title, 'job'));
                ELSEIF NEW.status = 'Rejected' THEN
                    SET description = CONCAT('Rejected applicant ', IFNULL(applicant_name, 'Unknown'), ' for ', IFNULL(job_title, 'job'));
                ELSE
                    SET description = CONCAT('Changed status of applicant ', IFNULL(applicant_name, 'Unknown'), ' to "', NEW.status, '"');
                END IF;

                INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
                VALUES (comp_id, 'UPDATE', 'Applicants', NEW.applicant_id, 'status', OLD.status, NEW.status, description);
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;
