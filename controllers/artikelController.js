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
    try {
      const response = await artikelRepository.getAllArtikel();
      res.status(200).json({ message: "success", data: response });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async getArtikelById(req, res) {
    try {
      const { id } = req.params;
      const response = await artikelRepository.findArtikelById(parseInt(id));
      if (!response)
        return res.status(404).json({ message: "Artikel Not Found" });

      res.status(200).json({ message: "success", response });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteArtikelById(req, res) {
    try {
      const { id } = req.params;
      const existArtikel = await artikelRepository.findArtikelById(
        parseInt(id)
      );
      if (!existArtikel)
        return res.status(404).json({ message: "Artikel Not Found" });

      await artikelRepository.deleteArtikel(parseInt(id));

      return res.status(200).json({ message: "delete successfuly" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createArtikel(req, res) {
    try {
      const { title, description, status, type, link, createdBy } = req.body;
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
        link,
        createdBy,
        media: {
          create: mediaUrls,
        },
      });

      return res.status(201).json({ message: "Artikel successfully added" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateArtikel(req, res) {
    try {
      const { id } = req.params;
      const { title, description, date, status, type, link, mediaIdsToDelete, updatedBy } =
        req.body;
      const files = req.files["media"];

      const existArtikel = await artikelRepository.findArtikelById(
        parseInt(id)
      );
      if (!existArtikel)
        return res.status(404).json({ message: "Artikel Not Found" });

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
        link,
        updatedBy,
        mediaIdsToDelete,
        newMediaData,
      });

      return res.status(200).json({
        message: "Artikel successfully updated",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ArtikelController();
