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

  async findClassByNip(nip, id) {
    return prisma.staff.findFirst({
      where: { nip },
      select: {
        id: true,
        uuid: true,
        name: true,
        CourseInClass: {
          ...(id != "" && { where: { id: parseInt(id) } }),
          include: {
            courseDetail: true,
            class: { include: { student: { include: { studentsGrades: true } } } },
          },
        },
      },
    });
  }
}

module.exports = new StaffRepository();
