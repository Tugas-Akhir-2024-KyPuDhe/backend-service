const { deleteMediaFromCloud } = require("../config/awsClound");
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
      status,
      type,
      category,
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

    const NewMediaIdsToDelete = mediaIdsToDelete ? mediaIdsToDelete.map((id) => parseInt(id)) : [];

    if (NewMediaIdsToDelete.length > 0) {
      for (const media of (await prisma.media.findMany({where: {
        id: {
          in: NewMediaIdsToDelete,
        },
      },}))) {
        await deleteMediaFromCloud(
          media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
        );
      }
      await prisma.media.deleteMany({
        where: {
          id: {
            in: NewMediaIdsToDelete,
          },
          Article: {
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
        status,
        type,
        category,
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

    for (const media of artikel.media) {
      await deleteMediaFromCloud(
        media.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
    }

    await prisma.media.deleteMany({
      where: { id: { in: artikel.media.map((media) => media.id) } },
    });

    if (artikel.banner) {
      await deleteMediaFromCloud(
        artikel.banner.url.replace(`${process.env.AWS_URL_IMG}/`, "")
      );
      await prisma.media.delete({
        where: { id: artikel.banner.id },
      });
    }

    return prisma.article.delete({
      where: { id },
    });
  }

  async getAllArtikel(page, perPage, search = "") {
    const skip = (page - 1) * perPage;

    return await prisma.article.findMany({
      skip: skip,
      take: perPage,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        media: true,
        banner: true,
      },
    });
  }

  async getTotalArtikel(search = "") {
    return await prisma.article.count({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
    });
  }

  async findArtikelById(id) {
    const isUuid = (val) =>
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        val
      );

    if (isUuid(id)) {
      return prisma.article.findFirst({
        where: { uuid: id },
        include: {
          media: true,
          banner: true,
        },
      });
    } else {
      return prisma.article.findFirst({
        where: { id: id },
        include: {
          media: true,
          banner: true,
        },
      });
    }
  }
}

module.exports = new ArtikelRepository();
