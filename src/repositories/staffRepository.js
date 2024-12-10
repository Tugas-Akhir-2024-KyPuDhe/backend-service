const prisma = require("../config/database");

class StaffRepository {
  async findStaffById(id) {
    return await prisma.staff.findUnique({
      where: { id },
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

  async findStaffByNip(nip) {
    return await prisma.staff.findUnique({
      where: { nip },
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

  async getAllStaff(tipe) {
    const queryOptions = {
      orderBy: {
        name: "asc",
      },
      include: {
        user: {
          select: {
            username: true,
            password: true,
            roles: true,
          },
        },
      },
    };

    if (tipe !== "") {
      queryOptions.where = {
        user: {
          roles: {
            some: {
              name: tipe.toUpperCase(),
            },
          },
        },
      };
    }

    return prisma.staff.findMany(queryOptions);
  }

  async updateUserStaff(id, data) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async updateStaff(id, data) {
    return await prisma.staff.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async findClassByNip(nip) {
    return prisma.staff.findMany({
      where: {
        nip, // Mencari berdasarkan NIP
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        // Menyertakan relasi
        CourseInClass: {
          include: {
            courseDetail: true, // Menyertakan detail kursus
            class: true, // Menyertakan data kelas
          },
        },
        Class: true, // Menyertakan data kelas di mana staff adalah wali kelas
      },
    });
  }
  
}

module.exports = new StaffRepository();
