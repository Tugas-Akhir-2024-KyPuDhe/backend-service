const prisma = require("../config/database");

class AcademicYearRepository {
  async createAcademicYear(data) {
    return prisma.academicYear.create({
      data: data,
    });
  }

  async updateAcademicYear(id, data) {
    const { name, status } = data;

    return await prisma.academicYear.update({
      where: { id: parseInt(id) },
      data: {
        name,
        status,
      },
    });
  }

  async deleteAcademicYear(id) {
    return prisma.academicYear.delete({
      where: { id },
    });
  }

  async getAllAcademicYear() {
    return prisma.academicYear.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findAcademicYearById(id) {
    return prisma.academicYear.findFirst({
      where: { id: id },
    });
  }

  async findAcademicYearByName(name) {
    return prisma.academicYear.findFirst({
      where: { name },
    });
  }
}

module.exports = new AcademicYearRepository();
