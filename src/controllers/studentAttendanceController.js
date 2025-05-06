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
          parseInt(classId),
          1
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
            status: studentAttendance ? studentAttendance.status : 0,
            notes: attendance.notes,
            tanggal: attendance.date.toISOString().split("T")[0],
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

  async getAttendanceByStudent(req, res) {
    try {
      const { nis, classId } = req.query;

      if (!nis) {
        return res.status(400).json({
          status: 400,
          message: "nis is required",
        });
      }

      // Panggil repository dengan nis dan classId
      const attendanceData = await studentAttendanceRepository.getAttendanceByNis(nis, classId);

      if (!attendanceData || attendanceData.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No attendance found for the specified student and class",
        });
      }

      // Ambil nama dan NIS siswa dari data pertama (karena NIS sama untuk semua record)
      const studentName = attendanceData[0].student.name;
      const studentNis = attendanceData[0].student.nis;

      // Kelompokkan data absensi berdasarkan bulan
      const groupedByMonth = attendanceData.reduce((acc, record) => {
        const date = new Date(record.attendance.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // Format: YYYY-MM

        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }

        acc[monthYear].push({
          id: record.id,
          attendanceId: record.attendanceId,
          status: record.status,
          notes: record.notes,
          date: record.attendance.date.toISOString().split("T")[0], // Format: YYYY-MM-DD
          className: record.attendance.class.name, // Nama kelas
        });

        return acc;
      }, {});

      // Ubah format groupedByMonth ke dalam array yang diinginkan
      const formattedAttendances = Object.keys(groupedByMonth).map((month) => ({
        month: month,
        records: groupedByMonth[month],
      }));

      res.status(200).json({
        status: 200,
        message: "Attendance retrieved successfully",
        data: {
          nis: studentNis,
          name: studentName,
          attendances: formattedAttendances,
        },
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
  
  async getWeeklyAttendance(req, res) {
    try {
      const { classId, date_start, date_end } = req.query;
  
      if (!classId || !date_start || !date_end) {
        return res.status(400).json({
          status: 400,
          message: "classId, date_start, and date_end are required"
        });
      }
  
      // Validasi format tanggal
      if (isNaN(new Date(date_start).getTime())) {
        return res.status(400).json({
          status: 400,
          message: "Invalid date_start format. Use YYYY-MM-DD"
        });
      }
  
      if (isNaN(new Date(date_end).getTime())) {
        return res.status(400).json({
          status: 400,
          message: "Invalid date_end format. Use YYYY-MM-DD"
        });
      }
  
      // Pastikan date_start <= date_end
      if (new Date(date_start) > new Date(date_end)) {
        return res.status(400).json({
          status: 400,
          message: "date_start must be less than or equal to date_end"
        });
      }
  
      const attendanceData = await studentAttendanceRepository.getAttendanceByClassAndDateRange(
        parseInt(classId),
        date_start,
        date_end
      );
  
      // Format response untuk mengisi tanggal yang tidak ada dengan data kosong
      const startDate = new Date(date_start);
      const endDate = new Date(date_end);
      const allDates = [];
      
      // Generate semua tanggal dalam rentang
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        allDates.push(new Date(date).toISOString().split('T')[0]);
      }
  
      // Format response
      const formattedResponse = allDates.map(dateStr => {
        const foundAttendance = attendanceData.find(att => 
          att.date.toISOString().split('T')[0] === dateStr
        );
        
        if (foundAttendance) {
          return {
            date: dateStr,
            attendance: foundAttendance
          };
        } else {
          return {
            date: dateStr,
            attendance: null
          };
        }
      });
  
      res.status(200).json({
        status: 200,
        message: "Weekly attendance retrieved successfully",
        data: formattedResponse
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message
      });
    }
  }
}

module.exports = new StudentAttendanceController();
