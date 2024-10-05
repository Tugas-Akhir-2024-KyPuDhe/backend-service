const prisma = require("../config/database");

class EkstrakurikulerRepository {
  async createEkstrakurikuler(data) {
    return prisma.ekstrakurikuler.create({
      data: data,
    });
  }

  async updateEkstrakurikuler(id, data) {
    const { name, description, prioritas, mediaIdsToDelete, newMediaData } =
      data;

    const ekstrakurikuler = await prisma.ekstrakurikuler.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!ekstrakurikuler) {
      throw new Error("Ekstrakurikuler not found");
    }

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
          Ekstrakurikuler: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
    }

    return await prisma.ekstrakurikuler.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        prioritas,
        media: { create: newMediaData },
      },
      include: {
        media: true,
      },
    });
  }

  async deleteEkstrakurikuler(id) {
    const ekstrakurikuler = await prisma.ekstrakurikuler.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!ekstrakurikuler) {
      throw new Error("Ekstrakurikuler not found");
    }

    // Delete the media
    await prisma.media.deleteMany({
      where: { id: { in: ekstrakurikuler.media.map((media) => media.id) } },
    });

    //delete media in cloud also here
    //...

    return prisma.ekstrakurikuler.delete({
      where: { id },
    });
  }

  async getAllEkstrakurikuler() {
    return prisma.ekstrakurikuler.findMany({
      orderBy: {
        prioritas: "asc",
      },
      include: {
        media: true,
      },
    });
  }

  async findEkstrakurikulerById(id) {
    return prisma.ekstrakurikuler.findFirst({
      where: { id: id },
      include: {
        media: true,
      },
    });
  }
}

module.exports = new EkstrakurikulerRepository();
