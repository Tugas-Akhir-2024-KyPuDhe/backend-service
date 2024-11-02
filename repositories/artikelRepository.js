const prisma = require("../config/database");

class ArtikelRepository {
  async createArtikel(data) {
    return prisma.article.create({
      data: data,
    });
  }

  async updateArtikel(id, data) {
    const {
      title,
      bannerId,
      description,
      date,
      status,
      type,
      link,
      mediaIdsToDelete,
      newMediaData,
    } = data;

    const artikel = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: { media: true },
    });

    if (!artikel) {
      throw new Error("Artikel not found");
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
          Artikel: {
            some: {
              id: parseInt(id),
            },
          },
        },
      });
    }

    return await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        bannerId,
        description,
        date,
        status,
        type,
        link,
        media: { create: newMediaData },
      },
      include: {
        media: true,
      },
    });
  }

  async deleteArtikel(id) {
    const artikel = await prisma.article.findUnique({
      where: { id },
      include: { media: true, banner: true },
    });

    if (!artikel) {
      throw new Error("Artikel not found");
    }

    // Delete the media
    await prisma.media.deleteMany({
      where: { id: { in: artikel.media.map((media) => media.id) } },
    });

    //delete media in cloud also here
    //...

    return prisma.article.delete({
      where: { id },
    });
  }

  async getAllArtikel() {
    return prisma.article.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        media: true,
        banner: true,
      },
    });
  }

  async findArtikelById(id) {
    return prisma.article.findFirst({
      where: { id: id },
      include: {
        media: true,
        banner: true,
      },
    });
  }
}

module.exports = new ArtikelRepository();
