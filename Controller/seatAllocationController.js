//working code
  // const db = require("../config/db"); // Assuming a database connection is established in db.js
// Allocate seats based on input
/*exports.allocateSeats = async (req, res) => {
  const {
    classroom_number,
    no_of_rows,
    no_of_columns,
    course_id1,
    course_id2,
    starting_student_id1,
    starting_student_id2,
    seat_types,
  } = req.body;

  try {
    // Validate that seat_types length matches total benches
    const totalBenches = no_of_rows * no_of_columns;
    if (seat_types.length !== totalBenches) {
      return res
        .status(400)
        .json({
          message: `Invalid input: seat_types must contain exactly ${totalBenches} entries.`,
        });
    }

    // Fetch classroom ID based on classroom number
    const [classroomRows] = await db.query(
      "SELECT classroom_id FROM Classrooms WHERE classroom_number = ?",
      [classroom_number]
    );
    if (!classroomRows.length)
      return res.status(404).json({ message: "Classroom not found" });

    const classroom_id = classroomRows[0].classroom_id;

    // Fetch students for the given courses starting from specified student IDs
    const [studentsCourse1] = await db.query(
      "SELECT student_id FROM Students WHERE student_id >= ? AND student_id IN (SELECT student_id FROM StudentCourses WHERE course_id = ?) ORDER BY student_id",
      [starting_student_id1, course_id1]
    );

    const [studentsCourse2] = await db.query(
      "SELECT student_id FROM Students WHERE student_id >= ? AND student_id IN (SELECT student_id FROM StudentCourses WHERE course_id = ?) ORDER BY student_id",
      [starting_student_id2, course_id2]
    );

    // Prepare seat allocation logic
    const allocations = [];
    let seatIndex = 0;

    for (let row = 1; row <= no_of_rows; row++) {
      for (let col = 1; col <= no_of_columns; col++) {
        let seatType = seat_types[seatIndex];
        let student1 = studentsCourse1.shift();
        let student2 = studentsCourse2.shift();

        if (seatType === "three_seater" && student1 && student2) {
          allocations.push({
            classroom_id,
            no_of_rows: row,
            no_of_columns: col,
            seat_type: seatType,
            seat_number: `Seat-${seatIndex + 1}`,
            student_ids: [student1.student_id, student2.student_id],
          });
        } else if (seatType === "five_seater") {
          allocations.push({
            classroom_id,
            no_of_rows: row,
            no_of_columns: col,
            seat_type: seatType,
            seat_number: `Seat-${seatIndex + 1}`,
            student_ids: [student1?.student_id, student2?.student_id].filter(
              Boolean
            ),
          });
        }

        seatIndex++;
      }
    }

    // Insert into ClassroomSeatAllocation table
    for (const allocation of allocations) {
      for (const student_id of allocation.student_ids) {
        await db.query(
          "INSERT INTO ClassroomSeatAllocation (classroom_id, no_of_rows, no_of_columns, seat_type, seat_number, student_id, course_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            allocation.classroom_id,
            allocation.no_of_rows,
            allocation.no_of_columns,
            allocation.seat_type,
            allocation.seat_number,
            student_id,
            allocation.student_ids.indexOf(student_id) === 0
              ? course_id1
              : course_id2,
          ]
        );
      }
    }

    res.json({ message: "Seats allocated successfully", allocations });
  } catch (error) {
    console.error("Database query error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while allocating seats", error });
  }
};
*/

const db = require("../config/db"); // Assuming a database connection is established in db.js

// Allocate seats based on input
exports.allocateSeats = async (req, res) => {
  const {
    classroom_number,
    no_of_rows,
    no_of_columns,
    course_id1,
    course_id2,
    starting_student_id1,
    starting_student_id2,
    seat_types,
  } = req.body;

  try {
    // Validate that seat_types length matches total benches
    const totalBenches = no_of_rows * no_of_columns;
    if (seat_types.length !== totalBenches) {
      return res.status(400).json({
        message: `Invalid input: seat_types must contain exactly ${totalBenches} entries.`,
      });
    }

    // Fetch classroom ID based on classroom number
    const [classroomRows] = await db.query(
      "SELECT classroom_id FROM Classrooms WHERE classroom_number = ?",
      [classroom_number]
    );
    if (!classroomRows.length)
      return res.status(404).json({ message: "Classroom not found" });

    const classroom_id = classroomRows[0].classroom_id;

    // Fetch students for the given courses starting from specified student IDs
    const [studentsCourse1] = await db.query(
      "SELECT student_id FROM Students WHERE student_id >= ? AND student_id IN (SELECT student_id FROM StudentCourses WHERE course_id = ?) ORDER BY student_id",
      [starting_student_id1, course_id1]
    );

    const [studentsCourse2] = await db.query(
      "SELECT student_id FROM Students WHERE student_id >= ? AND student_id IN (SELECT student_id FROM StudentCourses WHERE course_id = ?) ORDER BY student_id",
      [starting_student_id2, course_id2]
    );

    // Prepare seat allocation logic
    const allocations = [];
    let seatIndex = 0;

    // Consider students with student_id >= starting_student_id for each course
    let filteredStudentsCourse1 = studentsCourse1.filter(
      (student) => student.student_id >= starting_student_id1
    );
    let filteredStudentsCourse2 = studentsCourse2.filter(
      (student) => student.student_id >= starting_student_id2
    );

    for (let row = 1; row <= no_of_rows; row++) {
      for (let col = 1; col <= no_of_columns; col++) {
        let seatType = seat_types[seatIndex];
        let student1 = filteredStudentsCourse1.shift();
        let student2 = filteredStudentsCourse2.shift();

        // Allocate seats based on seat type and available students
        if (seatType === "three_seater" && student1 && student2) {
          allocations.push({
            classroom_id,
            no_of_rows: row,
            no_of_columns: col,
            seat_type: seatType,
            seat_number: `Seat-${seatIndex + 1}`,
            student_ids: [student1.student_id, student2.student_id],
          });
        } else if (seatType === "five_seater" && student1) {
          allocations.push({
            classroom_id,
            no_of_rows: row,
            no_of_columns: col,
            seat_type: seatType,
            seat_number: `Seat-${seatIndex + 1}`,
            student_ids: [student1.student_id, student2?.student_id].filter(Boolean),
          });
        }

        seatIndex++;
      }
    }

    // Insert into ClassroomSeatAllocation table
    for (const allocation of allocations) {
      for (const student_id of allocation.student_ids) {
        await db.query(
          "INSERT INTO ClassroomSeatAllocation (classroom_id, no_of_rows, no_of_columns, seat_type, seat_number, student_id, course_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            allocation.classroom_id,
            allocation.no_of_rows,
            allocation.no_of_columns,
            allocation.seat_type,
            allocation.seat_number,
            student_id,
            allocation.student_ids.indexOf(student_id) === 0 ? course_id1 : course_id2,
          ]
        );
      }
    }

    res.json({ message: "Seats allocated successfully", allocations });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "An error occurred while allocating seats", error });
  }
};
