const prisma = require("../config/database");

class ConfigSchoolRepository {
  async createConfigSchool(data) {
    return prisma.configSchool.create({
      data: data,
    });
  }

  async findConfigById(id) {
    return prisma.configSchool.findFirst({
      where: { id: id },
      include: {
        logo: true,
      },
    });
  }

  async updateConfigSchool(id, data) {
    const {
      name,
      about,
      vision,
      mision,
      address,
      mediaId,
      telp,
      email,
      npsn,
      fb,
      ig,
      tiktok,
    } = data; 

    const config = await prisma.configSchool.findUnique({
      where: { id: parseInt(id) },
      include: { logo: true },
    });

    if (!config) {
      throw new Error("Config not found");
    }

    return await prisma.configSchool.update({
      where: { id: parseInt(id) },
      data: {
        name,
        about,
        vision,
        mision,
        address,
        mediaId,
        telp,
        email,
        npsn,
        fb,
        ig,
        tiktok,
      }
    });
  }

  async getConfigSchool() {
    return prisma.configSchool.findFirst({
      include: { logo: true }
    });
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
