const prisma = require("../config/database");

class JurusanRepository {
  async createJurusan(data) {
    return prisma.major.create({
      data: data,
    });
  }

  async updateJurusan(id, data) {
    const { name, description, prioritas, mediaIdsToDelete, newMediaData } =
      data;

    const jurusan = await prisma.major.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!jurusan) {
      throw new Error("Jurusan not found");
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
          Jurusan: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
    }

    return await prisma.major.update({
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

  async deleteJurusan(id) {
    const jurusan = await prisma.major.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!jurusan) {
      throw new Error("Jurusan not found");
    }

    // Delete the media
    await prisma.media.deleteMany({
      where: { id: { in: jurusan.media.map((media) => media.id) } },
    });

    //delete media in cloud also here
    //...

    return prisma.major.delete({
      where: { id },
    });
  }

  async getAllJurusan() {
    return prisma.major.findMany({
      orderBy: {
        prioritas: "asc",
      },
      include: {
        media: true,
      },
    });
  }

  async findJurusanById(id) {
    return prisma.major.findFirst({
      where: { id: id },
      include: {
        media: true,
      },
    });
  }
}

module.exports = new JurusanRepository();
