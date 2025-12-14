-- Remove the trigger that logs tag removals (User request: "don't include the tags")
DROP TRIGGER IF EXISTS trg_job_tag_after_delete;

-- Remove the specific generic trigger that logs "Job post deleted (ID: ...)"
DROP TRIGGER IF EXISTS job_posts_after_delete;
DROP TRIGGER IF EXISTS trg_job_post_after_delete;

-- (The new trigger 'trg_job_post_before_delete' from the previous step will handle the single log line: "Deleted job post: [Job Title]")
