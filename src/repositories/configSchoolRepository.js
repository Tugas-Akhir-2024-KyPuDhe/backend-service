const prisma = require("../config/database");

class ConfigSchoolRepository {
  async createConfigSchool(data) {
    return prisma.configSchool.create({
      data: data,
    });
  }

  async updateConfigSchool(data) {
    return prisma.configSchool.updateMany({
      data: data,
    });
  }

  async getConfigSchool() {
    return prisma.configSchool.findFirst({});
  }

  async countStudent() {
    return await prisma.user.count({
      where: {
        roles: {
          some: {
            name: "STUDENT",
          },
        },
      },
    });
  }

  async countTeacher() {
    return await prisma.user.count({
      where: {
        roles: {
          some: {
            name: "TEACHER",
          },
        },
      },
    });
  }

  async countStaff() {
    return await prisma.user.count({
      where: {
        roles: {
          some: {
            name: "STAFF",
          },
        },
      },
    });
  }

  async countMajor() {
    return await prisma.major.count({});
  }
}

module.exports = new ConfigSchoolRepository();
