const prisma = require("../config/database");
const artikelRepository = require("../repositories/artikelRepository");
const myfunc = require("../utils/functions");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const storage = multerS3({
  s3: s3Client,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const title = req.body.title || "default-title";
    const fileExtension = path.extname(file.originalname);
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "-");
    let filename = "";

    if (file.fieldname === "banner") {
      filename = `artikel-berita/banner_${sanitizedTitle}-${Date.now()}${fileExtension}`;
    } else if (file.fieldname === "media") {
      filename = `artikel-berita/media_${sanitizedTitle}-${Date.now()}${fileExtension}`;
    }

    cb(null, filename);
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
    const { page = 1, per_page = 15, keyword = "" } = req.query;
    const currentPage = Number(page);
    const itemsPerPage = Number(per_page);

    try {
      const response = await artikelRepository.getAllArtikel(
        currentPage,
        itemsPerPage,
        keyword
      );
      const totalArticles = await artikelRepository.getTotalArtikel(keyword);
      const lastPage =
        totalArticles > 0 ? Math.ceil(totalArticles / itemsPerPage) : 1;
      const from = (currentPage - 1) * itemsPerPage + 1;
      const to =
        totalArticles > 0
          ? Math.min(from + itemsPerPage - 1, totalArticles)
          : 0;

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all articles.",
        total: totalArticles,
        per_page: itemsPerPage,
        current_page: currentPage,
        last_page: lastPage,
        from: totalArticles > 0 ? from : 0,
        to: to,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve articles due to internal server error.",
        error,
      });
    }
  }

  async getArtikelById(req, res) {
    try {
      const { id } = req.params;
      const response = await artikelRepository.findArtikelById(parseInt(id));
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "Article not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the article.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve article due to error: ${error.message}`,
      });
    }
  }

  async deleteArtikelById(req, res) {
    try {
      const { id } = req.params;
      const existArtikel = await artikelRepository.findArtikelById(
        parseInt(id)
      );
      if (!existArtikel)
        return res.status(404).json({
          status: 404,
          message: "Article not found. Cannot delete a non-existing article.",
        });

      await artikelRepository.deleteArtikel(parseInt(id));

      return res
        .status(200)
        .json({ status: 200, message: "Article deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete article due to error: ${error.message}`,
      });
    }
  }

  async createArtikel(req, res) {
    try {
      const { title, description, status, type, createdBy } = req.body;
      let bannerId = null;
      const mediaFiles = req.files?.["media"] || [];
      const mediaUrls = mediaFiles.map((file) => ({
        url: file.location, // Lokasi file yang disimpan di S3
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      if (req.files["banner"]) {
        const banner = req.files["banner"][0];
        const bannerUrl = banner.location;
        const bannerResponse = await prisma.media.create({
          data: {
            url: bannerUrl,
            type: banner.mimetype.startsWith("image") ? "image" : "video",
          },
        });
        bannerId = bannerResponse.id;
      }
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
      return res.status(400).json({
        status: 400,
        message: `Failed to create article due to error: ${error.message}`,
      });
    }
  }

  async updateArtikel(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status, type, mediaIdsToDelete, updatedBy } =
        req.body;
      const files = req.files?.["media"] || [];

      const existArtikel = await artikelRepository.findArtikelById(
        parseInt(id)
      );
      if (!existArtikel) {
        return res.status(404).json({
          status: 400,
          message: "Article not found. Unable to update non-existing article.",
        });
      }

      let bannerId = existArtikel.bannerId;
      if (req.files["banner"]) {
        const banner = req.files["banner"][0];
        const bannerUrl = banner.location;

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

      // Menyimpan data media baru
      const newMediaData =
        files.length > 0
          ? files.map((file) => ({
              url: file.location,
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;

      await artikelRepository.updateArtikel(id, {
        title,
        bannerId,
        description,
        status,
        type,
        updatedBy,
        mediaIdsToDelete,
        newMediaData: newMediaData || undefined,
      });

      return res.status(200).json({
        status: 200,
        message: "Article successfully updated.",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update article due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new ArtikelController();
