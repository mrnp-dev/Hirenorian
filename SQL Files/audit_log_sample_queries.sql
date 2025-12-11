================================================================================
STUDENT PROFILE AUDIT LOG - SAMPLE QUERIES
================================================================================
This file contains sample INSERT queries for tracking CRUD operations
on the Student Edit Profile page.
================================================================================

--------------------------------------------------------------------------------
1. CONTACT INFORMATION UPDATES
--------------------------------------------------------------------------------

-- Update Personal Email
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'personal_email', 'old.email@gmail.com', 'new.email@gmail.com', '192.168.1.100');

-- Update Phone Number
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'phone_number', '09123456789', '09987654321', '192.168.1.100');

-- Update Location
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentProfile', 'location', 'Manila, Philippines', 'Quezon City, Philippines', '192.168.1.100');


--------------------------------------------------------------------------------
2. PERSONAL DETAILS UPDATES
--------------------------------------------------------------------------------

-- Update First Name
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'first_name', 'Juan', 'John', '192.168.1.100');

-- Update Last Name
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'last_name', 'Dela Cruz', 'Santos', '192.168.1.100');

-- Update Middle Initial
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'middle_initial', 'A', 'B', '192.168.1.100');

-- Update Suffix
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'suffix', NULL, 'Jr.', '192.168.1.100');


--------------------------------------------------------------------------------
3. ABOUT ME UPDATES
--------------------------------------------------------------------------------

-- Update About Me
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentProfile', 'about_me', 
    'I am a passionate IT student.', 
    'I am a dedicated Computer Science student with a passion for web development and AI.', 
    '192.168.1.100');


--------------------------------------------------------------------------------
4. SKILLS CRUD OPERATIONS
--------------------------------------------------------------------------------

-- CREATE: Add New Technical Skill
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, new_value, ip_address)
VALUES 
    (202012345, 'CREATE', 'StudentSkills', 123, 'skill_name', 'Python', '192.168.1.100');

-- CREATE: Add New Soft Skill
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, new_value, ip_address)
VALUES 
    (202012345, 'CREATE', 'StudentSkills', 124, 'skill_name', 'Leadership', '192.168.1.100');

-- DELETE: Remove Skill
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, ip_address)
VALUES 
    (202012345, 'DELETE', 'StudentSkills', 123, 'skill_name', 'Python', '192.168.1.100');


--------------------------------------------------------------------------------
5. EDUCATION HISTORY CRUD OPERATIONS
--------------------------------------------------------------------------------

-- CREATE: Add New Education History
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, new_value, ip_address)
VALUES 
    (202012345, 'CREATE', 'StudentEducationHistory', 456, 
    '{"degree":"Bachelor of Science in Information Technology","institution":"Don Honorio Ventura State University","start_year":"2020","end_year":"Present"}', 
    '192.168.1.100');

-- UPDATE: Edit Education History - Degree
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentEducationHistory', 456, 'degree', 
    'BS Information Technology', 
    'Bachelor of Science in Information Technology', 
    '192.168.1.100');

-- UPDATE: Edit Education History - Institution
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentEducationHistory', 456, 'institution', 
    'DHVSU', 
    'Don Honorio Ventura State University', 
    '192.168.1.100');

-- UPDATE: Edit Education History - Years
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentEducationHistory', 456, 'end_year', '2024', 'Present', '192.168.1.100');

-- DELETE: Remove Education History
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, old_value, ip_address)
VALUES 
    (202012345, 'DELETE', 'StudentEducationHistory', 456, 
    '{"degree":"Senior High School - STEM","institution":"ABC Senior High School","start_year":"2018","end_year":"2020"}', 
    '192.168.1.100');


--------------------------------------------------------------------------------
6. EXPERIENCE CRUD OPERATIONS
--------------------------------------------------------------------------------

-- CREATE: Add New Experience
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, new_value, ip_address)
VALUES 
    (202012345, 'CREATE', 'StudentExperience', 789, 
    '{"job_title":"Web Developer Intern","company_name":"Tech Solutions Inc.","start_date":"2023","end_date":"2024","description":"Developed responsive websites using React and Node.js"}', 
    '192.168.1.100');

-- UPDATE: Edit Experience - Job Title
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentExperience', 789, 'job_title', 
    'Intern', 
    'Web Developer Intern', 
    '192.168.1.100');

-- UPDATE: Edit Experience - Company
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentExperience', 789, 'company_name', 
    'Tech Solutions', 
    'Tech Solutions Inc.', 
    '192.168.1.100');

-- UPDATE: Edit Experience - Description
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentExperience', 789, 'description', 
    'Developed websites', 
    'Developed responsive websites using React and Node.js', 
    '192.168.1.100');

-- UPDATE: Edit Experience - Dates
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentExperience', 789, 'end_date', '2024', 'Present', '192.168.1.100');

-- DELETE: Remove Experience
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, record_id, old_value, ip_address)
VALUES 
    (202012345, 'DELETE', 'StudentExperience', 789, 
    '{"job_title":"Freelance Designer","company_name":"Self-employed","start_date":"2022","end_date":"2023","description":"Created graphic designs for small businesses"}', 
    '192.168.1.100');


--------------------------------------------------------------------------------
7. PROFILE PICTURE UPDATES
--------------------------------------------------------------------------------

-- Update Profile Picture
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'StudentProfile', 'profile_picture', 
    '/var/www/html/Hirenorian/API/studentDB_APIs/Student%20Accounts/202012345/Images/profile_pic_1701234567.jpg', 
    '/var/www/html/Hirenorian/API/studentDB_APIs/Student%20Accounts/202012345/Images/profile_pic_1702345678.jpg', 
    '192.168.1.100');


--------------------------------------------------------------------------------
8. PASSWORD CHANGE
--------------------------------------------------------------------------------

-- Password Change (Don't log actual passwords, just track the action)
INSERT INTO StudentProfileAuditLog 
    (student_id, action_type, table_affected, field_name, old_value, new_value, ip_address)
VALUES 
    (202012345, 'UPDATE', 'Students', 'password_hash', '[REDACTED]', '[REDACTED]', '192.168.1.100');


================================================================================
QUERYING AUDIT LOGS
================================================================================

-- Get all changes made by a specific student
SELECT * FROM StudentProfileAuditLog 
WHERE student_id = 202012345 
ORDER BY action_timestamp DESC;

-- Get all changes to a specific table
SELECT * FROM StudentProfileAuditLog 
WHERE table_affected = 'StudentEducationHistory' 
ORDER BY action_timestamp DESC;

-- Get recent changes (last 7 days)
SELECT * FROM StudentProfileAuditLog 
WHERE action_timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
ORDER BY action_timestamp DESC;

-- Get all CREATE operations
SELECT * FROM StudentProfileAuditLog 
WHERE action_type = 'CREATE' 
ORDER BY action_timestamp DESC;

-- Get all changes to a specific record
SELECT * FROM StudentProfileAuditLog 
WHERE table_affected = 'StudentEducationHistory' 
  AND record_id = 456 
ORDER BY action_timestamp DESC;

-- Get field-level history for a specific field
SELECT student_id, old_value, new_value, action_timestamp
FROM StudentProfileAuditLog 
WHERE student_id = 202012345 
  AND field_name = 'personal_email'
ORDER BY action_timestamp DESC;

-- Count actions by type per student
SELECT student_id, action_type, COUNT(*) as action_count
FROM StudentProfileAuditLog
GROUP BY student_id, action_type
ORDER BY student_id, action_type;

-- Get most active students (by number of edits)
SELECT student_id, COUNT(*) as total_edits
FROM StudentProfileAuditLog
GROUP BY student_id
ORDER BY total_edits DESC
LIMIT 10;

================================================================================
