const prisma = require("../config/database");

class StudentHistoryRepository {
  async getAllHistory(id) {
    return prisma.historyClass.findMany({
      orderBy: {
        academicYear: "asc",
      },
      where: { studentId: id },
      include: {
        currentClass: {
          include: {
            homeRoomTeacher: true,
            StudentsGrades: { include: { teacher: true } },
          },
        },
      },
    });
  }
}

module.exports = new StudentHistoryRepository();
