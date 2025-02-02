const prisma = require("../config/database");

class SchoolYearRepository {
  async createSchoolYear(data) {
    return prisma.schoolYear.create({
      data: data,
    });
  }

  async updateSchoolYear(id, data) {
    const { name, status } = data;

    return await prisma.schoolYear.update({
      where: { id: parseInt(id) },
      data: {
        name,
        status,
      },
    });
  }

  async deleteSchoolYear(id) {
    return prisma.schoolYear.delete({
      where: { id },
    });
  }

  async getAllSchoolYear() {
    return prisma.schoolYear.findMany({
      orderBy: {
        prioritas: "asc",
      },
    });
  }

  async findSchoolYearById(id) {
    return prisma.schoolYear.findFirst({
      where: { id: id },
    });
  }
}

module.exports = new SchoolYearRepository();
