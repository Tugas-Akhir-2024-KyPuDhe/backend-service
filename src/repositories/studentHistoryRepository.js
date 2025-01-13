const prisma = require("../config/database");

class StudentHistoryRepository {
  async getAllHistoryStudent(id, nis) {
    return prisma.historyClass.findMany({
      orderBy: {
        academicYear: "asc",
      },
      where: { studentId: id },
      include: {
        student: true,
        currentClass: {
          include: {
            CourseInClass: {
              include: {
                teacher: true,
                courseDetail: {
                  include: {
                    StudentsGrades: {
                      where: {
                        nis: { equals: nis },
                      },
                    },
                  },
                },
              },
            },
            homeRoomTeacher: true,
          },
        },
      },
    });
  }

  async getDetailHistoryStudent(uuid, nis) {
    return prisma.historyClass.findFirst({
      orderBy: {
        academicYear: "asc",
      },
      where: { uuid },
      include: {
        student: true,
        currentClass: {
          include: {
            CourseInClass: {
              include: {
                teacher: true,
                courseDetail: {
                  include: {
                    StudentsGrades: {
                      where: {
                        nis: { equals: nis },
                      },
                    },
                  },
                },
              },
            },
            homeRoomTeacher: true,
          },
        },
      },
    });
  }

  async getStudentById(id) {
    return prisma.student.findFirst({
      where: { id },
    });
  }

  async getHistoryDetail(uuid) {
    return prisma.historyClass.findFirst({
      where: { uuid },
    });
  }
}

module.exports = new StudentHistoryRepository();
