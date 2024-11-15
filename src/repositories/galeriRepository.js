const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class GaleriRepository {
  async createGaleri(data) {
    return prisma.galeri.create({
      data: data,
    });
  }

  async updateGaleri(id, data) {
    const { name, description, prioritas, mediaIdsToDelete, newMediaData } = data;

    const galeri = await prisma.galeri.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!galeri) {
      throw new Error("Galeri not found");
    }

    const NewMediaIdsToDelete = mediaIdsToDelete ? mediaIdsToDelete.map((id) => parseInt(id)) : [];

    if (NewMediaIdsToDelete.length > 0) {
      await prisma.media.deleteMany({
        where: {
          id: {
            in: NewMediaIdsToDelete,
          },
          Facility: {
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
        media: { create: newMediaData },
      },
      include: {
        media: true,
      },
    });
  }


  async deleteGaleri(id) {
    const galeri = await prisma.galeri.findUnique({
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

  async getAllGaleri() {
    return prisma.galeri.findMany({
      orderBy: {
        prioritas: "asc",
      },
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
}

module.exports = new GaleriRepository();
