-- Drop the trigger that logs tags (as requested: "don't include the tags")
DROP TRIGGER IF EXISTS trg_job_tag_after_insert;

-- Drop generic Job Post triggers that don't have the title
DROP TRIGGER IF EXISTS trg_job_post_after_insert;
DROP TRIGGER IF EXISTS job_posts_after_insert;

-- Drop the existing Job Details trigger so we can recreate it with the specific message
DROP TRIGGER IF EXISTS trg_job_details_after_insert;

DELIMITER $$

-- Create the new trigger on Job_Details (where the Title is stored)
-- This will be the SINGLE log entry for creating a new job post.
CREATE TRIGGER trg_job_details_after_insert
AFTER INSERT ON Job_Details
FOR EACH ROW
BEGIN
    DECLARE comp_id INT;
    -- Get the company ID from the parent Job_Posts table
    SELECT company_id INTO comp_id FROM Job_Posts WHERE post_id = NEW.post_id;

    IF comp_id IS NOT NULL THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (comp_id, 'CREATE', 'Job_Posts', NEW.post_id, CONCAT('Posted a job post: ', IFNULL(NEW.title, 'Untitled')));
    END IF;
END$$

DELIMITER ;
