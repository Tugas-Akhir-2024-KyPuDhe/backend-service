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

  async updateUser(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }
  
}

module.exports = new AuthRepository();
