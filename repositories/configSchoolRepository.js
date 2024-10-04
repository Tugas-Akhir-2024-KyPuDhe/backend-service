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
}

module.exports = new ConfigSchoolRepository();
