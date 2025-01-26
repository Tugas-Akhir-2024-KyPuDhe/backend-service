const studentAttendanceRepository = require("../repositories/studentAttendanceRepository");
const { mapStatusToLetter } = require("../utils/functions");

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
        attendanceData =
          await studentAttendanceRepository.getAttendanceByClassAndDate(
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

  async updateAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      const { data } = req.body;

      if (!attendanceId || !data || data.length === 0) {
        return res.status(400).json({
          status: 400,
          message:
            "attendanceId and data are required, and data must not be empty",
        });
      }

      const existingAttendance =
        await studentAttendanceRepository.getAttendanceById(
          parseInt(attendanceId)
        );

      if (!existingAttendance || existingAttendance.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No attendance found for the specified attendanceId",
        });
      }

      const updatePromises = data.map((detail) =>
        studentAttendanceRepository.updateDetailAttendance({
          id: detail.id,
          attendanceId: parseInt(attendanceId),
          nis: detail.nis,
          notes: detail.notes,
          status: detail.status,
        })
      );

      await Promise.all(updatePromises);

      res.status(200).json({
        status: 200,
        message: "Attendance updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updateStatusAttendance(req, res) {
    try {
      const { attendanceId } = req.params;
      if (!attendanceId) {
        return res.status(400).json({
          status: 400,
          message:
            "attendanceId and data are required, and data must not be empty",
        });
      }

      const existingAttendance =
        await studentAttendanceRepository.getAttendanceById(
          parseInt(attendanceId)
        );

      if (!existingAttendance || existingAttendance.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No attendance found for the specified attendanceId",
        });
      }

      await studentAttendanceRepository.updateFinalAttendance(
        parseInt(attendanceId),
        1
      );

      res.status(200).json({
        status: 200,
        message: "Attendance updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getAttendanceSummary(req, res) {
    try {
      const { classId } = req.params;

      const classData = await studentAttendanceRepository.getStudentsInClass(
        parseInt(classId)
      );
      if (!classData || !classData.student || classData.student.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No students found for the specified classId",
        });
      }

      const attendanceData =
        await studentAttendanceRepository.getAttendanceByClass(
          parseInt(classId)
        );
      if (!attendanceData || attendanceData.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No attendance records found for the specified classId",
        });
      }

      // Format data menjadi sesuai permintaan
      const result = classData.student.map((student) => {
        const absensi = attendanceData.map((attendance) => {
          const studentAttendance = attendance.detailAttendanceStudents.find(
            (detail) => detail.nis === student.nis
          );

          return {
            status: studentAttendance
              ? mapStatusToLetter(studentAttendance.status)
              : "N/A", // Default jika tidak ada data
            notes: attendance.notes, // Format tanggal menjadi YYYY-MM-DD
            tanggal: attendance.date.toISOString().split("T")[0], // Format tanggal menjadi YYYY-MM-DD
          };
        });

        return {
          nis: student.nis,
          name: student.name,
          absensi,
        };
      });

      res.status(200).json({
        status: 200,
        message: "Attendance summary retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  // Helper function to map status code to letter
  
}

module.exports = new StudentAttendanceController();
