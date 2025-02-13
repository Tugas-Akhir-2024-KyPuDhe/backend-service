const prisma = require("../config/database");

class StudentGradeRepository {
  async getGradeByNIS(nis) {
    return prisma.studentsGrades.findMany({
      where: { nis },
      orderBy: {
        createdAt: "asc",
      },
      include: { class: true, teacher: true, course: true },
    });
  }

  async insertGrade(data) {
    return prisma.studentsGrades.create({
      data: data,
    });
  }

  async findGradeByNISClassAndCourse(nis, classId, courseCode) {
    return prisma.studentsGrades.findFirst({
      where: {
        AND: [{ nis: nis }, { classId: classId }, { courseCode }],
      },
    });
  }

  async updateGrade(id, data) {
    return await prisma.studentsGrades.update({
      where: { id: parseInt(id) },
      data: data,
    });
  }
}

module.exports = new StudentGradeRepository();
