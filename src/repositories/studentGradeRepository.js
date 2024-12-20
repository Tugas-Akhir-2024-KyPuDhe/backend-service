const prisma = require("../config/database");

class StudentGradeRepository {
  async insertGrade(data) {
    return prisma.studentsGrades.create({
      data: data,
    });
  }

  async findGradeByNISAndClass(nis, classId) {
    return prisma.studentsGrades.findFirst({
      where: {
        AND: [{ nis: nis }, { classId: classId }],
      },
    });
  }

  async updateGrade(id, data) {
    const {
      nis,
      teacherId,
      classId,
      courseCode,
      task,
      UH,
      PTS,
      PAS,
      portofolio,
      proyek,
      attitude,
      description,
    } = data;

    return await prisma.studentsGrades.update({
      where: { id: parseInt(id) },
      data: {
        nis,
        teacherId,
        classId,
        courseCode,
        task,
        UH,
        PTS,
        PAS,
        portofolio,
        proyek,
        attitude,
        description,
      },
    });
  }
}

module.exports = new StudentGradeRepository();
