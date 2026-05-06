CREATE DATABASE IF NOT EXISTS campus_ticket_pro;
USE campus_ticket_pro;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(160) NOT NULL,
  password_salt VARCHAR(64) NOT NULL,
  role ENUM('student', 'faculty', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
);

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  department VARCHAR(120) NULL,
  category VARCHAR(80) NULL,
  event_date DATE NULL,
  event_time VARCHAR(40) NULL,
  venue VARCHAR(160) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  seats INT NOT NULL DEFAULT 0,
  description TEXT NULL,
  banner_url TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Draft',
  created_by VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_events_status (status),
  INDEX idx_events_department (department)
);

CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  event_id INT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'paid',
  qr_code TEXT NULL,
  ticket_code VARCHAR(80) NULL,
  student_name VARCHAR(120) NOT NULL,
  student_email VARCHAR(160) NOT NULL,
  mobile VARCHAR(30) NULL,
  event_name VARCHAR(180) NOT NULL,
  event_department VARCHAR(120) NULL,
  event_category VARCHAR(80) NULL,
  event_date VARCHAR(40) NULL,
  event_time VARCHAR(40) NULL,
  event_venue VARCHAR(160) NULL,
  event_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  event_seats INT NOT NULL DEFAULT 0,
  seat VARCHAR(30) NULL,
  payment_method VARCHAR(60) NULL,
  title VARCHAR(180) NULL,
  description TEXT NULL,
  category VARCHAR(80) NULL,
  priority VARCHAR(30) NULL DEFAULT 'medium',
  requester_name VARCHAR(120) NULL,
  requester_email VARCHAR(160) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tickets_student (student_id),
  INDEX idx_tickets_student_email (student_email),
  INDEX idx_tickets_event (event_id),
  INDEX idx_tickets_status (status),
  INDEX idx_tickets_payment_status (payment_status)
);

CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  student_id INT NOT NULL,
  event_id INT NOT NULL,
  attendance_status VARCHAR(30) NOT NULL DEFAULT 'not_marked',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_registrations_ticket (ticket_id),
  UNIQUE KEY uq_registrations_student_event (student_id, event_id),
  INDEX idx_registrations_event (event_id),
  INDEX idx_registrations_attendance_status (attendance_status)
);

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NULL,
  student_id INT NOT NULL,
  event_id INT NOT NULL,
  attendance_status VARCHAR(30) NOT NULL DEFAULT 'not_marked',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_student_event (student_id, event_id),
  INDEX idx_attendance_ticket (ticket_id),
  INDEX idx_attendance_status (attendance_status)
);
