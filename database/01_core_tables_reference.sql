-- =====================================================================
-- UNIERA  —  Core tables (reference schema for a FRESH install only)
-- ---------------------------------------------------------------------
-- These are the tables your original app.py already uses
-- (signup, enroll, cities, tuition_base, fixed_costs, universities,
--  scholarships, eligibility_criteria, cost_estimates).
--
-- If your MySQL "uniera" database ALREADY has these tables with data,
-- you do NOT need to run this file. Everything is CREATE ... IF NOT EXISTS,
-- so running it is harmless, but it will not change existing tables.
--
-- The NEW tables (applications, documents, status history, notifications,
-- chatbot, consultancy staff, university details, courses) are created
-- automatically by the backend when Flask starts (see schema.py).
-- =====================================================================

CREATE DATABASE IF NOT EXISTS uniera;
USE uniera;

CREATE TABLE IF NOT EXISTS signup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enroll (
  enroll_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  full_name VARCHAR(120), phone_number VARCHAR(20), alternate_phone VARCHAR(20),
  email VARCHAR(150), date_of_birth DATE,
  gender ENUM('Male','Female','Other','Prefer_not_to_say'),
  nationality VARCHAR(60), passport_number VARCHAR(30),
  current_address VARCHAR(255), current_city VARCHAR(80), current_country VARCHAR(80),
  emergency_contact_name VARCHAR(120), emergency_contact_relation VARCHAR(50), emergency_contact_phone VARCHAR(20),
  highest_qualification VARCHAR(30), field_of_study VARCHAR(120), institution_name VARCHAR(150),
  graduation_year INT, percentage_gpa VARCHAR(20),
  academic_gap ENUM('Yes','No') DEFAULT 'No', academic_gap_reason VARCHAR(255),
  backlogs ENUM('Yes','No') DEFAULT 'No', backlogs_count INT DEFAULT 0,
  english_test_type ENUM('IELTS','TOEFL','PTE','Duolingo','Not_Taken') DEFAULT 'Not_Taken',
  english_test_score VARCHAR(10),
  other_test_type ENUM('GRE','GMAT','SAT','None') DEFAULT 'None', other_test_score VARCHAR(10),
  preferred_country VARCHAR(60), preferred_university VARCHAR(150), preferred_course VARCHAR(150),
  course_level VARCHAR(30), intake_month_year VARCHAR(30),
  budget_range VARCHAR(50), funding_source VARCHAR(30),
  work_experience_years INT DEFAULT 0,
  visa_applied_before ENUM('Yes','No') DEFAULT 'No', visa_rejected_before ENUM('Yes','No') DEFAULT 'No',
  visa_rejection_details VARCHAR(255),
  transcript_file VARCHAR(255), passport_file VARCHAR(255), resume_file VARCHAR(255),
  sop_file VARCHAR(255), recommendation_letter_file VARCHAR(255),
  declaration_agreed VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  city VARCHAR(60) PRIMARY KEY,
  state VARCHAR(10) NOT NULL,
  is_regional TINYINT(1) DEFAULT 0,
  tuition_index DECIMAL(4,2) DEFAULT 1.00,
  living_cost_aud INT NOT NULL
);

CREATE TABLE IF NOT EXISTS tuition_base (
  level VARCHAR(30) PRIMARY KEY,
  tuition_min_aud INT NOT NULL,
  tuition_max_aud INT NOT NULL
);

CREATE TABLE IF NOT EXISTS fixed_costs (
  id INT PRIMARY KEY,
  oshc_per_year_aud INT, visa_fee_aud INT, airfare_aud INT, initial_setup_aud INT
);

CREATE TABLE IF NOT EXISTS universities (
  university_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(60), state VARCHAR(10),
  uni_tier VARCHAR(30),
  website VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS scholarships (
  scholarship_id INT AUTO_INCREMENT PRIMARY KEY,
  university_id INT NULL,
  name VARCHAR(200), level VARCHAR(30), field VARCHAR(60),
  amount_aud INT, coverage VARCHAR(20),
  min_percentage DECIMAL(5,2), min_ielts DECIMAL(3,1),
  deadline DATE NULL, apply_link VARCHAR(255), description TEXT
);

CREATE TABLE IF NOT EXISTS eligibility_criteria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level VARCHAR(30), uni_tier VARCHAR(30),
  min_percentage DECIMAL(5,2), min_ielts DECIMAL(3,1), min_funds_aud INT,
  notes VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS cost_estimates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL, city VARCHAR(60), level VARCHAR(30),
  duration_years DECIMAL(3,1), total_aud INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
