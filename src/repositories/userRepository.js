const prisma = require("../config/database");

class UserRepository {
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
            ParentOfStudent: true
          },
        },
      },
    });
  }

  async getAllUser(tipeUser) {
    if (tipeUser === "staff") {
      return prisma.staff.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          user: {  // Menyertakan data dari tabel User yang berelasi
              select: {
                  username: true,
                  password: true,
              },
          },
      },
      });
    } else if (tipeUser === "student") {
      return prisma.student.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          Major: true,
          user: {  // Menyertakan data dari tabel User yang berelasi
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
