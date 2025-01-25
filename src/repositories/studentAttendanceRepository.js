const prisma = require("../config/database");

class StudentAttendanceRepository {
  async createAttendance(data) {
    return prisma.studentAttendance.create({
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
    return prisma.studentDetailAttendance.createMany({
      data: details,
    });
  }

  async getAttendanceByClassAndDate(classId, date) {
    return prisma.studentAttendance.findFirst({
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
    return prisma.studentAttendance.findMany({
      where: {
        classId: classId,
      },
      include: {
        detailAttendanceStudents: { include: { student: true } },
      },
    });
  }

  async getAttendanceById(id) {
    return prisma.studentAttendance.findMany({
      where: { id },
      include: {
        detailAttendanceStudents: { include: { student: true } },
      },
    });
  }

  async updateDetailAttendance({ id, attendanceId, nis, notes, status }) {
    return prisma.studentDetailAttendance.update({
      where: { id }, // Berdasarkan ID detail attendance
      data: {
        attendanceId,
        nis,
        notes,
        status,
      },
    });
  }

  async updateFinalAttendance(id, status) {
    return prisma.studentAttendance.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}

module.exports = new StudentAttendanceRepository();
