DELIMITER $$

-- Trigger for FIRST TIME upload (INSERT)
-- Logs specific document uploads
DROP TRIGGER IF EXISTS trg_company_docs_after_insert$$
CREATE TRIGGER trg_company_docs_after_insert
AFTER INSERT ON Company_Documents
FOR EACH ROW
BEGIN
    IF NEW.philjobnet_path IS NOT NULL AND NEW.philjobnet_path != '' THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'CREATE', 'Company_Documents', NEW.doc_id, 'Uploaded PhilJobNet document');
    END IF;

    IF NEW.dole_path IS NOT NULL AND NEW.dole_path != '' THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'CREATE', 'Company_Documents', NEW.doc_id, 'Uploaded DOLE document');
    END IF;

    IF NEW.bir_path IS NOT NULL AND NEW.bir_path != '' THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'CREATE', 'Company_Documents', NEW.doc_id, 'Uploaded BIR document');
    END IF;

    IF NEW.mayor_permit_path IS NOT NULL AND NEW.mayor_permit_path != '' THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'CREATE', 'Company_Documents', NEW.doc_id, 'Uploaded Mayor''s Permit document');
    END IF;
END$$

-- Trigger for RE-UPLOADS (UPDATE)
-- Logs specific document updates
DROP TRIGGER IF EXISTS trg_company_docs_after_update$$
CREATE TRIGGER trg_company_docs_after_update
AFTER UPDATE ON Company_Documents
FOR EACH ROW
BEGIN
    -- PhilJobNet
    IF (OLD.philjobnet_path != NEW.philjobnet_path) OR (OLD.philjobnet_path IS NULL AND NEW.philjobnet_path IS NOT NULL) THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company_Documents', NEW.doc_id, 'Updated PhilJobNet document');
    END IF;

    -- DOLE
    IF (OLD.dole_path != NEW.dole_path) OR (OLD.dole_path IS NULL AND NEW.dole_path IS NOT NULL) THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company_Documents', NEW.doc_id, 'Updated DOLE document');
    END IF;

    -- BIR
    IF (OLD.bir_path != NEW.bir_path) OR (OLD.bir_path IS NULL AND NEW.bir_path IS NOT NULL) THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company_Documents', NEW.doc_id, 'Updated BIR document');
    END IF;

    -- Mayor's Permit
    IF (OLD.mayor_permit_path != NEW.mayor_permit_path) OR (OLD.mayor_permit_path IS NULL AND NEW.mayor_permit_path IS NOT NULL) THEN
        INSERT INTO company_activity_log (company_id, action_type, table_affected, record_id, action_description)
        VALUES (NEW.company_id, 'UPDATE', 'Company_Documents', NEW.doc_id, 'Updated Mayor''s Permit document');
    END IF;
END$$

DELIMITER ;
