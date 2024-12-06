const prisma = require("../config/database");

class StaffRepository {
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
}

module.exports = new StaffRepository();
