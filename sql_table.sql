CREATE DATABASE exam_db;
USE exam_db;
CREATE TABLE Students (
    student_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO Students VALUES ('S001', 'Alice');
INSERT INTO Students VALUES ('S002', 'Bob');
INSERT INTO Students VALUES ('S003', 'Charlie');
INSERT INTO Students VALUES ('S004', 'Diana');
INSERT INTO Students VALUES ('S005', 'Eve');
INSERT INTO Students VALUES ('S006', 'Frank');
INSERT INTO Students VALUES ('S007', 'Grace');
INSERT INTO Students VALUES ('S008', 'Hannah');
INSERT INTO Students VALUES ('S009', 'Ivan');
INSERT INTO Students VALUES ('S010', 'Jack');

CREATE TABLE Courses (
    course_id VARCHAR(20) PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL
);

INSERT INTO Courses VALUES ('C101', 'Math');
INSERT INTO Courses VALUES ('C102', 'Science');
INSERT INTO Courses VALUES ('C103', 'English');
INSERT INTO Courses VALUES ('C104', 'History');


CREATE TABLE StudentCourses (
    student_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(30) NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE TABLE Classrooms (
    classroom_id INT AUTO_INCREMENT PRIMARY KEY, 
    classroom_number INT NOT NULL, 
    no_of_rows INT NOT NULL, 
    no_of_columns INT NOT NULL
);

CREATE TABLE ClassroomCourse (
    classroom_course_id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    course_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (classroom_id) REFERENCES Classrooms(classroom_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE TABLE ClassroomSeatConfiguration (
    classroom_course_id INT NOT NULL,  -- Reference to ClassroomCourse table
    no_of_rows INT NOT NULL,
    no_of_columns INT NOT NULL,
    seat_type ENUM('three_seater', 'five_seater') NOT NULL,
    seat_number VARCHAR(50) NOT NULL, 
    PRIMARY KEY (classroom_course_id, no_of_rows, no_of_columns),
    FOREIGN KEY (classroom_course_id) REFERENCES ClassroomCourse(classroom_course_id)
);

CREATE TABLE ClassroomSeatAllocation (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    classroom_id INT NOT NULL,
    no_of_rows INT NOT NULL,
    no_of_columns INT NOT NULL,
    seat_type ENUM('three_seater', 'five_seater') NOT NULL,
    seat_number VARCHAR(50) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(30) NOT NULL,
    FOREIGN KEY (classroom_id) REFERENCES Classrooms(classroom_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO StudentCourses VALUES ('S001', 'C101');

-- S003: Enrolled only in C101
INSERT INTO StudentCourses VALUES ('S003', 'C101');

-- S007: Enrolled only in C101
INSERT INTO StudentCourses VALUES ('S007', 'C101');

-- S010: Enrolled only in C101
INSERT INTO StudentCourses VALUES ('S010', 'C101');

-- S002: Enrolled only in C102
INSERT INTO StudentCourses VALUES ('S002', 'C102');

-- S004: Enrolled only in C103
INSERT INTO StudentCourses VALUES ('S004', 'C103');

-- S008: Enrolled only in C102
INSERT INTO StudentCourses VALUES ('S008', 'C102');

-- S009: Enrolled only in C103
INSERT INTO StudentCourses VALUES ('S009', 'C103');

-- S006: Enrolled only in C101
INSERT INTO StudentCourses VALUES ('S006', 'C101');