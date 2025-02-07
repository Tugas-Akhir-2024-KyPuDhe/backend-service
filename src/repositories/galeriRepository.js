const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class GaleriRepository {
  async createGaleri(data) {
    return prisma.galeri.create({
      data: data,
    });
  }

  async updateGaleri(id, data) {
    const {
      name,
      description,
      prioritas,
      status,
      mediaIdsToDelete,
      newMediaData,
    } = data;

    const galeri = await prisma.galeri.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!galeri) {
      throw new Error("Galeri not found");
    }

    const NewMediaIdsToDelete = mediaIdsToDelete
      ? mediaIdsToDelete.map((id) => parseInt(id))
      : [];

    if (NewMediaIdsToDelete.length > 0) {
      for (const media of await prisma.media.findMany({
        where: {
          id: {
            in: NewMediaIdsToDelete,
          },
        },
      })) {
        await deleteMediaFromCloud(
          media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
        );
      }

      await prisma.media.deleteMany({
        where: {
          id: {
            in: NewMediaIdsToDelete,
          },
          Galeri: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
    }

    return await prisma.galeri.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        prioritas: parseInt(prioritas),
        status,
        media: { create: newMediaData },
      },
      include: {
        media: true,
      },
    });
  }

  async deleteGaleri(id) {
    const galeri = await prisma.galeri.findFirst({
      where: { id },
      include: { media: true },
    });

    if (!galeri) {
      throw new Error("Galeri not found");
    }

    for (const media of galeri.media) {
      await deleteMediaFromCloud(
        media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
    }

    await prisma.media.deleteMany({
      where: { id: { in: galeri.media.map((media) => media.id) } },
    });

    return prisma.galeri.delete({
      where: { id },
    });
  }

  async getAllGaleri(status) {
    let whereCondition = {};
    if (status !== "Active") {
      whereCondition = {};
    } else {
      whereCondition = { status: status };
    }
    return prisma.galeri.findMany({
      orderBy: {
        prioritas: "asc",
      },
      where: whereCondition,
      include: {
        media: true,
      },
    });
  }

  async findGaleriById(id) {
    return prisma.galeri.findFirst({
      where: { id: id },
      include: {
        media: true,
      },
    });
  }

  async deleteMediaById(mediaId) {
    const media = await prisma.media.findUnique({
      where: { id: parseInt(mediaId) },
    });

    if (!media) {
      throw new Error("Media not found");
    }
    await deleteMediaFromCloud(
      media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
    );
    await prisma.media.delete({
      where: { id: parseInt(mediaId) },
    });

    return media;
  }
}

module.exports = new GaleriRepository();
