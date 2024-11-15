const prisma = require("../config/database");

class StudentRepository {
  async findStudentByNis(nis) {
    return await prisma.student.findUnique({
      where: { nis },
      include: {
        user: {
          select: {
            password: true,
            username: true,
            roles: true,
          },
        },
        photo: true,
      },
    });
  }
}

module.exports = new StudentRepository();
