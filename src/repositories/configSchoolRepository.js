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
      historySchool,
      about,
      vision,
      mission,
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
        historySchool,
        about,
        vision,
        mission,
        address,
        mediaId,
        telp,
        email,
        npsn,
        fb,
        ig,
        tiktok,
      },
    });
  }
  async updateLogoConfigSchool(id, mediaId) {
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
        mediaId,
      },
    });
  }

  async getConfigSchool() {
    return prisma.configSchool.findFirst({
      include: { logo: true },
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

  async countAlumni() {
    const studyTracer = await prisma.studyTracer.count({where: {statusApprove: 'Disetujui'}});
    const student = await prisma.student.count({where: {status: "Lulus"}})

    return studyTracer + student;
  }
}

module.exports = new ConfigSchoolRepository();
