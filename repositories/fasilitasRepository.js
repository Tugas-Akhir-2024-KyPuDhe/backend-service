const { deleteMediaFromCloud } = require("../config/awsClound");
const prisma = require("../config/database");

class FasilitasRepository {
  async createFasilitas(data) {
    return prisma.facility.create({
      data: data,
    });
  }

  async updateFasilitas(id, data) {
    const { name, description, prioritas, mediaIdsToDelete, newMediaData } =
      data;

    const fasilitas = await prisma.facility.findUnique({
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

    return await prisma.facility.update({
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

  async deleteFasilitas(id) {
    const fasilitas = await prisma.facility.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!fasilitas) {
      throw new Error("Fasilitas not found");
    }

    for (const media of fasilitas.media) {
      await deleteMediaFromCloud(
        media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
    }

    await prisma.media.deleteMany({
      where: { id: { in: fasilitas.media.map((media) => media.id) } },
    });

    return prisma.facility.delete({
      where: { id },
    });
  }

  async getAllFasilitas() {
    return prisma.facility.findMany({
      orderBy: {
        prioritas: "asc",
      },
      include: {
        media: true,
      },
    });
  }

  async findFasilitasById(id) {
    return prisma.facility.findFirst({
      where: { id: id },
      include: {
        media: true,
      },
    });
  }
}

module.exports = new FasilitasRepository();
