const prisma = require("../config/database");

class StudentAttendanceRepository {
  async createAttendance(data) {
    return prisma.attendanceStudents.create({
      data: data,
    });
  }

  async getStudentsInClass(id) {
    return prisma.class.findUnique({
      where: { id },
      include: { student: true },
    });
  }

  async createDetailAttendance(details) {
    return prisma.detailAttendanceStudents.createMany({
      data: details,
    });
  }

  async getAttendanceByClassAndDate(classId, date) {
    return prisma.attendanceStudents.findFirst({
      where: {
        classId: classId,
        date: date,
      },
      include: {
        detailAttendanceStudents: { include: { student: true } },
      },
    });
  }

  async getAttendanceByClass(classId) {
    return prisma.attendanceStudents.findMany({
      where: {
        classId: classId,
      },
      include: {
        detailAttendanceStudents: { include: { student: true } },
      },
    });
  }
}

module.exports = new StudentAttendanceRepository();
