const prisma = require("../config/database");

class FasilitasRepository {
  async createFasilitas(data) {
    return prisma.fasilitas.create({
      data: data,
    });
  }

  async updateFasilitas(id, data) {
    const { name, description, prioritas, mediaIdsToDelete, newMediaData } =
      data;

    const fasilitas = await prisma.fasilitas.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!fasilitas) {
      throw new Error("Fasilitas not found");
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
          Fasilitas: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
    }

    return await prisma.fasilitas.update({
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

  async deleteFasilitas(id) {
    const fasilitas = await prisma.fasilitas.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!fasilitas) {
      throw new Error("Fasilitas not found");
    }

    // Delete the media
    await prisma.media.deleteMany({
      where: { id: { in: fasilitas.media.map((media) => media.id) } },
    });

    //delete media in cloud also here
    //...

    return prisma.fasilitas.delete({
      where: { id },
    });
  }

  async getAllFasilitas() {
    return prisma.fasilitas.findMany({
      orderBy: {
        prioritas: "asc",
      },
      include: {
        media: true,
      },
    });
  }

  async findFasilitasById(id) {
    return prisma.fasilitas.findFirst({
      where: { id: id },
      include: {
        media: true,
      },
    });
  }
}

module.exports = new FasilitasRepository();