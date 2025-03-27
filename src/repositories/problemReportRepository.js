const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class ProblemReportRepository {
  async createProblemReport(data) {
    return prisma.problemReport.create({
      data: data,
    });
  }

  async updateProblemReport(id, data) {
    
  }

  async deleteProblemReport(id) {
    const problemReport = await prisma.problemReport.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!problemReport) {
      throw new Error("Problem Report not found");
    }

    if (problemReport.media) {
      await deleteMediaFromCloud(
        problemReport.media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
      await prisma.media.delete({
        where: { id: problemReport.mediaId },
      });
    }

    return prisma.problemReport.delete({
      where: { id },
    });
  }

  async getAllProblemReport() {
    return prisma.problemReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        media: true,
      },
    });
  }

  async findProblemReportById(id) {
    return prisma.problemReport.findFirst({
      where: { id: id },
      include: {
        media: true,
      },
    });
  }
}

module.exports = new ProblemReportRepository();
