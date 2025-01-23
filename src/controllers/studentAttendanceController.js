const studentAttendanceRepository = require("../repositories/studentAttendanceRepository");

class StudentAttendanceController {
  async createAttendance(req, res) {
    try {
      const { classId, date, createdBy, notes } = req.body;

      const existingAttendance =
        await studentAttendanceRepository.getAttendanceByClassAndDate(
          parseInt(classId),
          new Date(date)
        );

      if (existingAttendance) {
        return res.status(400).json({
          status: 400,
          message: "Attendance already exists for the specified class and date",
          data: existingAttendance,
        });
      }

      const attendance = await studentAttendanceRepository.createAttendance({
        classId: parseInt(classId),
        date: new Date(date),
        createdBy,
        notes,
      });

      const classStudents =
        await studentAttendanceRepository.getStudentsInClass(classId);

      if (!classStudents || classStudents.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No classStudents found for the specified classId",
        });
      }

      const detailAttendances = classStudents.student.map((student) => ({
        attendanceId: attendance.id,
        nis: student.nis,
        notes: null,
      }));

      await studentAttendanceRepository.createDetailAttendance(
        detailAttendances
      );

      res.status(200).json({
        status: 200,
        message: "Attendance and student details created successfully",
        data: { attendance, detailAttendances },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAttendance(req, res) {
    try {
      const { classId, date } = req.query;

      if (!classId) {
        return res.status(400).json({
          status: 400,
          message: "classId is required",
        });
      }

      let attendanceData;
      if (date) {
        attendanceData = await studentAttendanceRepository.getAttendanceByClassAndDate(
          parseInt(classId),
          new Date(date)
        );
      } else {
        attendanceData = await studentAttendanceRepository.getAttendanceByClass(
          parseInt(classId)
        );
      }

      if (!attendanceData || attendanceData.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No attendance found for the specified criteria",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Attendance retrieved successfully",
        data: attendanceData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new StudentAttendanceController();
