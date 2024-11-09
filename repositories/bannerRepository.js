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

    // Update the banner
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

    await prisma.media.delete({
      where: { id: banner.bannerId  },
    });

    // Optional: handle media deletion in cloud here

    // Delete the banner
    return prisma.bannerPage.delete({
      where: { id },
    });
  }

  async getAllBanner() {
    return prisma.bannerPage.findMany({
      orderBy: {
        prioritas: "asc",
      },
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
