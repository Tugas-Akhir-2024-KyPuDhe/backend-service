const prisma = require("../config/database");

class StudyTracerRepository {
  async createStudyTracer(data) {
    return prisma.studyTracer.create({
      data: data,
    });
  }

  async deleteStudyTracer(id) {
    return prisma.studyTracer.delete({
      where: { id },
    });
  }

  async getAllStudyTracer() {
    return prisma.studyTracer.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findStudyTracerById(id) {
    return await prisma.studyTracer.findUnique({
      where: { id },
    });
  }

  async updateStudyTracer(id, data) {
    return prisma.studyTracer.update({
      where: { id },
      data: data,
    });
  }
}

module.exports = new StudyTracerRepository();
