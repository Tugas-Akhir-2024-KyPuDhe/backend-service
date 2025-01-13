const prisma = require("../config/database");

class StudentPositionInClassRepository {
  async createStudentPosition(data) {
    return prisma.studentPositionInClass.create({
      data: data,
    });
  }

  async deletePositionById(id) {
    return prisma.studentPositionInClass.findUnique({
      where: { id },
    });
  }

  async findPositionById(id) {
    return prisma.studentPositionInClass.findFirst({
      where: { id: id },
    });
  }

  async findPositionByClassId(id) {
    return prisma.studentPositionInClass.findMany({
      where: { classId: id },
    });
  }
}

module.exports = new StudentPositionInClassRepository();
