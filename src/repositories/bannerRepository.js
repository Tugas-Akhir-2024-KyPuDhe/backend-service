const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class BannerRepository {
  async createBanner(data) {
    return prisma.bannerPage.create({
      data: data,
    });
  }

  async updateBanner(id, data) {
    const {
      title,
      description,
      title_link,
      link,
      prioritas,
      status,
      bannerId,
    } = data;

    const banner = await prisma.bannerPage.findUnique({
      where: { id: parseInt(id) },
      include: { banner: true },
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    return await prisma.bannerPage.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        title_link,
        link,
        prioritas: parseInt(prioritas),
        status,
        bannerId,
      },
      include: {
        banner: true,
      },
    });
  }

  async deleteBanner(id) {
    const banner = await prisma.bannerPage.findUnique({
      where: { id },
      include: { banner: true },
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    if (banner.banner) {
      await deleteMediaFromCloud(
        banner.banner.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
      await prisma.media.delete({
        where: { id: banner.bannerId },
      });
    }

    return prisma.bannerPage.delete({
      where: { id },
    });
  }

  async getAllBanner(status) {
    let whereCondition = {};
    if (status !== "active") {
      whereCondition = {};
    } else {
      whereCondition = { status: status };
    }

    return prisma.bannerPage.findMany({
      orderBy: {
        prioritas: "asc",
      },
      where: whereCondition,
      include: {
        banner: true,
      },
    });
  }

  async findBannerById(id) {
    return prisma.bannerPage.findFirst({
      where: { id: id },
      include: {
        banner: true,
      },
    });
  }
}

module.exports = new BannerRepository();
