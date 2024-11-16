const { deleteMediaFromCloud } = require("../config/awsClound");
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

    const NewMediaIdsToDelete = mediaIdsToDelete ? mediaIdsToDelete.map((id) => parseInt(id)) : [];

    if (NewMediaIdsToDelete.length > 0) {
      await prisma.media.deleteMany({
        where: {
          id: {
            in: NewMediaIdsToDelete,
          },
          Major: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
    }

    for (const media of jurusan.media) {
      await deleteMediaFromCloud(
        media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
    }

    return await prisma.major.update({
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

  async deleteJurusan(id) {
    const jurusan = await prisma.major.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!jurusan) {
      throw new Error("Jurusan not found");
    }

    for (const media of jurusan.media) {
      await deleteMediaFromCloud(
        media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
    }

    await prisma.media.deleteMany({
      where: { id: { in: jurusan.media.map((media) => media.id) } },
    });

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
