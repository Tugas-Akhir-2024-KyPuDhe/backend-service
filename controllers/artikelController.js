const prisma = require("../config/database");
const artikelRepository = require("../repositories/artikelRepository");
const myfunc = require("../utils/functions");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

class ArtikelController {
  uploadFiles() {
    return multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4/;
        const extname = fileTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        } else {
          return cb(
            new Error("Invalid file type. Only images and videos are allowed."),
            false
          );
        }
      },
    }).fields([
      { name: "banner", maxCount: 1 },
      { name: "media", maxCount: 10 },
    ]);
  }

  async getAllArtikel(req, res) {
    const { page = 1, per_page = 15 } = req.query;
    const currentPage = Number(page);
    const itemsPerPage = Number(per_page);

    try {
      const response = await artikelRepository.getAllArtikel(
        currentPage,
        itemsPerPage
      );
      const totalArticles = await artikelRepository.getTotalArtikel();

      const lastPage = Math.ceil(totalArticles / itemsPerPage);
      const from = (currentPage - 1) * itemsPerPage + 1;
      const to = Math.min(from + itemsPerPage - 1, totalArticles);

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all articles.",
        total: totalArticles,
        per_page: itemsPerPage,
        current_page: currentPage,
        last_page: lastPage,
        from: from,
        to: to,
        data: response,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve articles due to internal server error.", error });
    }
  }

  async getArtikelById(req, res) {
    try {
      const { id } = req.params;
      const response = await artikelRepository.findArtikelById(parseInt(id));
      if (!response)
        return res
          .status(404)
          .json({ status: 404, message: "Article not found. The provided ID does not match any records." });

      res.status(200).json({ status: 200, message: "Successfully retrieved the article.", data: response });
    } catch (error) {
      res.status(400).json({ status: 400, message: `Failed to retrieve article due to error: ${error.message}` });
    }
  }

  async deleteArtikelById(req, res) {
    try {
      const { id } = req.params;
      const existArtikel = await artikelRepository.findArtikelById(
        parseInt(id)
      );
      if (!existArtikel)
        return res
          .status(404)
          .json({ status: 404, message: "Article not found. Cannot delete a non-existing article." });

      await artikelRepository.deleteArtikel(parseInt(id));

      return res
        .status(200)
        .json({ status: 200, message: "Article deleted successfully." });
    } catch (error) {
      res.status(400).json({ status: 400, message: `Failed to delete article due to error: ${error.message}` });
    }
  }

  async createArtikel(req, res) {
    try {
      const { title, description, status, type, createdBy } = req.body;
      const files = req.files["media"];
      let bannerId = null;

      if (req.files["banner"]) {
        const banner = req.files["banner"][0];
        const bannerUrl = `https://dummyurl.com/media/artikel/banner-${myfunc.fileName(
          title
        )}-${myfunc.getRandomDigit(4)}`;

        const bannerResponse = await prisma.media.create({
          data: {
            url: bannerUrl,
            type: banner.mimetype.startsWith("image") ? "image" : "video",
          },
        });
        bannerId = bannerResponse.id;
      }

      const mediaUrls = files
        ? files.map((file, index) => ({
            url: `https://dummyurl.com/media/artikel/${myfunc.fileName(
              title
            )}-${myfunc.getRandomDigit(4)}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];

      await artikelRepository.createArtikel({
        title,
        bannerId,
        description,
        status,
        type,
        createdBy,
        media: {
          create: mediaUrls,
        },
      });

      return res
        .status(201)
        .json({ status: 201, message: "Article successfully created." });
    } catch (error) {
      res.status(400).json({ status: 400, message: `Failed to create article due to error: ${error.message}` });
    }
  }

  async updateArtikel(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        date,
        status,
        type,
        mediaIdsToDelete,
        updatedBy,
      } = req.body;
      const files = req.files["media"];

      const existArtikel = await artikelRepository.findArtikelById(
        parseInt(id)
      );
      if (!existArtikel)
        return res
          .status(404)
          .json({ status: 400, message: "Article not found. Unable to update non-existing article." });

      let bannerId = existArtikel.bannerId;

      if (req.files["banner"]) {
        const banner = req.files["banner"][0];
        const bannerUrl = `https://dummyurl.com/media/artikel/banner-${myfunc.fileName(
          title
        )}-${myfunc.getRandomDigit(4)}`;

        if (bannerId == null) {
          const bannerResponse = await prisma.media.create({
            data: {
              url: bannerUrl,
              type: banner.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          bannerId = bannerResponse.id;
        } else {
          const bannerResponse = await prisma.media.update({
            where: { id: parseInt(bannerId) },
            data: {
              url: bannerUrl,
              type: banner.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          bannerId = bannerResponse.id;
        }
      }

      const newMediaData = files
        ? files.map((file) => ({
            url: `https://dummyurl.com/media/artikel/${myfunc.fileName(
              title
            )}-${myfunc.getRandomDigit(4)}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];
      await artikelRepository.updateArtikel(id, {
        title,
        bannerId,
        description,
        date,
        status,
        type,
        updatedBy,
        mediaIdsToDelete,
        newMediaData,
      });

      return res.status(200).json({
        status: 200,
        message: "Article successfully updated.",
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: `Failed to update article due to error: ${error.message}` });
    }
  }
}

module.exports = new ArtikelController();
