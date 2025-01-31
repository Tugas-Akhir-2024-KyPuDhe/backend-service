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
        detailAttendanceStudents: {
          include: {
            student: true,
          },
          orderBy: {
            student: {
              name: "asc",
            },
          },
        },
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

  async getAttendanceByClass(classId, status = 0) {
    const whereCondition = {
      classId: classId,
      ...(status !== 0 && { status: status }),
    };

    return prisma.studentAttendance.findMany({
      where: whereCondition,
      include: {
        detailAttendanceStudents: { include: { student: true } },
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async getAttendanceByNis(nis, classId, status=1) {
    const attendanceData = await prisma.studentDetailAttendance.findMany({
      where: {
        nis: nis,
        attendance: {
          status: status,
          classId: classId ? parseInt(classId) : undefined,
        },
      },
      include: {
        attendance: {
          include: {
            class: true,
          },
        },
        student: true,
      },
      orderBy: {
        attendance: {
          date: "asc",
        },
      },
    });

    return attendanceData;
  }
}

module.exports = new StudentAttendanceRepository();
