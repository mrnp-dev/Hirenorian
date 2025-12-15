DELIMITER $$

-- ==========================================================
-- 1. FIX "Untitled" DELETE LOG
-- Problem: Job_Details is deleted BEFORE Job_Posts, so triggers on Job_Posts can't find the title.
-- Solution: Log the deletion when Job_Details is deleted.
-- ==========================================================

-- Drop the previous ineffective trigger on Job_Posts
DROP TRIGGER IF EXISTS trg_job_post_before_delete;
DROP TRIGGER IF EXISTS trg_job_post_after_delete; -- Just in case

-- Drop any existing triggers on Job_Details delete to avoid duplicates
DROP TRIGGER IF EXISTS trg_job_details_before_delete;
DROP TRIGGER IF EXISTS job_details_before_delete;

CREATE TRIGGER trg_job_details_before_delete
BEFORE DELETE ON Job_Details
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    -- We need to fetch company_id from Job_Posts because Job_Details might not have it (depending on schema, usually it's in Posts)
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = OLD.post_id;
    
    IF comp_id IS NOT NULL THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (comp_id, 'DELETE', 'Job_Posts', OLD.post_id, CONCAT('Deleted job post: ', IFNULL(OLD.title, 'Untitled')));
    END IF;
END$$


-- ==========================================================
-- 2. FIX DOUBLE LOGGING ON CLOSE
-- Problem: Multiple triggers existed for Job_Posts UPDATE.
-- Solution: Drop ALL old/redundant triggers and keep only the refined one.
-- ==========================================================

-- Drop the OLD generic trigger that logs "Job post status changed from..."
DROP TRIGGER IF EXISTS job_posts_after_update;

-- Drop our OWN previous attempt to ensure we have a clean slate for the update trigger
DROP TRIGGER IF EXISTS trg_job_post_after_update;

-- Re-create the SINGLE authoritative update trigger
CREATE TRIGGER trg_job_post_after_update
AFTER UPDATE ON Job_Posts
FOR EACH ROW
BEGIN
    DECLARE job_title VARCHAR(255);
    DECLARE description VARCHAR(500);

    -- Only log if status changed
    IF OLD.status != NEW.status THEN
        -- Fetch Job Title from Job_Details (which still exists during UPDATE)
        SELECT title INTO job_title FROM Job_Details WHERE post_id = NEW.post_id LIMIT 1;
        
        SET description = CONCAT('Changed status of job "', IFNULL(job_title, 'Untitled'), '" to "', NEW.status, '"');
        
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, field_name, old_value, new_value, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Job_Posts', NEW.post_id, 'status', OLD.status, NEW.status, description);
    END IF;
END$$

DELIMITER ;
