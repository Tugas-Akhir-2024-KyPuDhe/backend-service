const prisma = require("../config/database");

class AuthRepository {
  async findUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        roles: true,
        staff: {
          include: {
            photo: true,
          },
        },
        students: {
          include: {
            photo: true,
          },
        },
      },
    });
  }

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: true,
        staff: true,
        students: true,
      },
    });
  }

  async createUser(data) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

}

module.exports = new AuthRepository();
