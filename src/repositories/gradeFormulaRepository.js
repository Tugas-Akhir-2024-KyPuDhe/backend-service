const prisma = require("../config/database");

class GradeFormulaRepository {
  async createFormula(data) {
    return prisma.gradeFormula.create({
      data: data,
    });
  }

  async updateFormula(id, data) {
    return prisma.gradeFormula.update({
      where: { id },
      data: data,
    });
  }

  async deleteFormula(id) {
    const usedInCourses = await prisma.course.count({
      where: { formulaId: id },
    });

    if (usedInCourses > 0) {
      throw new Error("Tidak bisa menghapus formula yang sedang digunakan");
    }

    return prisma.gradeFormula.delete({
      where: { id },
    });
  }

  async getAllFormulas() {
    return prisma.gradeFormula.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        components: { where: { type: "main" }, include: { children: true } },
      },
    });
  }

  async getFormulaById(id) {
    return prisma.gradeFormula.findUnique({
      where: { id },
      include: {
        components: { where: { type: "main" }, include: { children: true } },
      },
    });
  }

  async addComponent(data) {
    return prisma.gradeComponent.create({
      data: data,
    });
  }

  async updateComponent(componentId, data) {
    return prisma.gradeComponent.update({
      where: { id: componentId },
      data: data,
    });
  }

  async getFormulaComponents(formulaId) {
    return prisma.gradeComponent.findMany({
      where: { formulaId },
      orderBy: { createdAt: "asc" },
    });
  }
}

module.exports = new GradeFormulaRepository();
