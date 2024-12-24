const prisma = require("../config/database");

class StudentHistoryRepository {
  async getAllHistory(id, nis) {
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

  async getStudentById(id) {
    return prisma.student.findFirst({
      where: { id },
    });
  }
}

module.exports = new StudentHistoryRepository();
