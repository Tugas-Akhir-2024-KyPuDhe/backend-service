const prisma = require("../config/database");

class UserRepository {
  async findUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        staff: {
          include: {
            photo: true,
          },
        },
        roles: true,
        students: {
          include: {
            photo: true,
            ParentOfStudent: true,
            class: true,
            Major: true,
            HistoryClass: { include: { currentClass: true } },
          },
        },
      },
    });
  }

  async getAllUser(tipeUser, majorCode) {
    if (tipeUser !== "student") {
      return prisma.staff.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          user: {
            select: {
              username: true,
              password: true,
              roles: true, // Jika diperlukan
            },
          },
        },
      });
    } else if (tipeUser === "student") {
      const whereClause = majorCode ? { Major: { majorCode: majorCode } } : {};

      return prisma.student.findMany({
        where: whereClause,
        orderBy: {
          name: "asc",
        },
        include: {
          Major: true,
          user: {
            select: {
              username: true,
              password: true,
            },
          },
        },
      });
    }
  }

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
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

  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }
}

module.exports = new UserRepository();
