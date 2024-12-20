const prisma = require("../config/database");

class StudentGradeRepository {
  async insertGrade(data) {
    return prisma.studentsGrades.create({
      data: data,
    });
  }
}

module.exports = new StudentGradeRepository();
