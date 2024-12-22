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
    const {
      nis,
      academicYear,
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
        academicYear,
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
