const prisma = require("../config/database");

class StudentPositionInClassRepository {
  async createStudentPosition(data) {
    return prisma.studentPositionInClass.create({
      data: data,
    });
  }
}

module.exports = new StudentPositionInClassRepository();
