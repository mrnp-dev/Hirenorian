<?php
// install_db_tables.php
include "db_con.php";

echo "<h1>Setting up Database Tables...</h1>";

$sql = "
CREATE TABLE IF NOT EXISTS StudentProfile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    location VARCHAR(255),
    about_me TEXT,
    profile_picture VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudentSkills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_category ENUM('Technical', 'Soft') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudentExperience (
    exp_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    description TEXT,
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StudentEducationHistory (
    edu_hist_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    institution VARCHAR(100) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    start_year VARCHAR(20),
    end_year VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE
);
";

try {
    $conn->exec($sql);
    echo "<p style='color: green;'>Tables created successfully (or already existed).</p>";
} catch (PDOException $e) {
    echo "<p style='color: red;'>Error creating tables: " . $e->getMessage() . "</p>";
}
?>
