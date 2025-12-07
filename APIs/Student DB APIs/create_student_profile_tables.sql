CREATE TABLE IF NOT EXISTS StudentProfile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(25) NOT NULL,
    location VARCHAR(255),
    about_me TEXT,
    profile_picture VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudentSkills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(25) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_category ENUM('Technical', 'Soft') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudentExperience (
    exp_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(25) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    description TEXT,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudentEducationHistory (
    edu_hist_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(25) NOT NULL,
    institution VARCHAR(100) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    start_year VARCHAR(20),
    end_year VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);
