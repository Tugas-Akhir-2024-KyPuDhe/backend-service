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
      mediaIdsToDelete,
      newMediaData,
    } = data;

    const banner = await prisma.bannerPage.findUnique({
      where: { id: parseInt(id) },
      include: { banner: true },
    });

    if (!banner) {
      throw new Error("Banner not found");
    }

    // Parse and handle media deletions
    const NewMediaIdsToDelete = mediaIdsToDelete
      ? JSON.parse(mediaIdsToDelete).map((id) => parseInt(id))
      : [];

    // Delete the specified media if any
    if (NewMediaIdsToDelete.length > 0) {
      await prisma.media.deleteMany({
        where: {
          id: {
            in: NewMediaIdsToDelete,
          },
          banner: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
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
        banner: {
          create: newMediaData, // Creating new media associated with the banner
        },
        updatedAt: new Date(), // Update the timestamp
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
