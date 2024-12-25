const prisma = require("../config/database");
const artikelRepository = require("../repositories/artikelRepository");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const {
  storage,
  s3Client,
  deleteMediaFromCloud,
} = require("../config/awsClound");

class ArtikelController {
  uploadFiles() {
    return multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm/;
        const extname = fileTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype =
          fileTypes.test(file.mimetype) || file.mimetype.startsWith("video/");

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
      { name: "media", maxCount: 10 },
      { name: "banner", maxCount: 1 },
    ]);
  }

  async compressAndUpload(req, res, next) {
    try {
      const { title } = req.body;
      const sanitizedTitle = title
        ? title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : "default";

      if (req.files) {
        if (req.files["banner"]) {
          const banner = req.files["banner"][0];
          let bannerBuffer = banner.buffer;
          let bannerKey = `artikel-berita/banner_${sanitizedTitle}_${Date.now()}`;

          if (
            banner.mimetype.startsWith("image") &&
            !banner.mimetype.includes("gif")
          ) {
            bannerBuffer = await sharp(bannerBuffer)
              .resize({ width: 800 })
              .jpeg({ quality: 80 })
              .toBuffer();
            bannerKey += ".jpg";
          } else {
            bannerKey += path.extname(banner.originalname);
          }

          // Upload to S3
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: bannerKey,
              Body: bannerBuffer,
              ACL: "public-read",
              ContentType: banner.mimetype,
            })
          );

          // Set the banner URL after uploading to S3
          req.bannerLocation = `${process.env.AWS_URL_IMG}/${bannerKey}`;
        }

        if (req.files["media"]) {
          req.mediaLocations = await Promise.all(
            req.files["media"].map(async (file) => {
              let fileBuffer = file.buffer;
              let mediaKey = `artikel-berita/media_${sanitizedTitle}_${Date.now()}`;

              if (
                file.mimetype.startsWith("image") &&
                !file.mimetype.includes("gif")
              ) {
                fileBuffer = await sharp(fileBuffer)
                  .resize({ width: 800 })
                  .jpeg({ quality: 80 })
                  .toBuffer();
                mediaKey += ".jpg";
              } else {
                mediaKey += path.extname(file.originalname);
              }

              // Upload to S3
              await s3Client.send(
                new PutObjectCommand({
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: mediaKey,
                  Body: fileBuffer,
                  ACL: "public-read",
                  ContentType: file.mimetype,
                })
              );

              // Return the URL after uploading
              return {
                url: `${process.env.AWS_URL_IMG}/${mediaKey}`, // Manually construct the URL
                type: file.mimetype.startsWith("image") ? "image" : "video",
              };
            })
          );
        }
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `File processing error: ${error.message}` });
    }
  }

  async getAllArtikel(req, res) {
    const { page = 1, per_page = 15, keyword = "", status = "PUBLISH" } = req.query;
  
    try {
      let response, totalArticles, lastPage, from, to;
  
      if (page === "no") {
        // Ambil semua artikel tanpa pagination
        response = await artikelRepository.getAllArtikelNoPagination(keyword, status);
        totalArticles = response.length;
        lastPage = 1; // Tidak ada halaman terakhir untuk non-paginated
        from = 1;
        to = totalArticles;
      } else {
        const currentPage = Number(page);
        const itemsPerPage = Number(per_page);
  
        response = await artikelRepository.getAllArtikel(
          currentPage,
          itemsPerPage,
          keyword,
          status
        );
        totalArticles = await artikelRepository.getTotalArtikel(keyword, status);
        lastPage =
          totalArticles > 0 ? Math.ceil(totalArticles / itemsPerPage) : 1;
        from = (currentPage - 1) * itemsPerPage + 1;
        to =
          totalArticles > 0
            ? Math.min(from + itemsPerPage - 1, totalArticles)
            : 0;
      }
  
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all articles.",
        total: totalArticles,
        per_page: page === "no" ? null : Number(per_page),
        current_page: page === "no" ? null : Number(page),
        last_page: page === "no" ? null : lastPage,
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
      const { type } = req.query;

      let response;
      if (type == "id") {
        response = await artikelRepository.findArtikelById(parseInt(id));
      } else {
        response = await artikelRepository.findArtikelByUuid(id);
      }
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
      const { title, description, status, type, category, createdBy } =
        req.body;
      let bannerId = null;
      const mediaFiles = req.files?.["media"] || [];
      const mediaUrls = mediaFiles.map((file, index) => ({
        url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      if (req.bannerLocation) {
        const bannerResponse = await prisma.media.create({
          data: {
            url: req.bannerLocation,
            type: "image",
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
        category,
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
      const {
        title,
        description,
        status,
        type,
        category,
        mediaIdsToDelete,
        updatedBy,
      } = req.body;
      const files = req.files?.["media"] || [];
      let bannerId = null;

      const existArtikel = await artikelRepository.findArtikelById(parseInt(id));
      if (!existArtikel) {
        return res.status(404).json({
          status: 400,
          message: "Article not found. Unable to update non-existing article.",
        });
      }

      bannerId = existArtikel.bannerId;
      if (req.bannerLocation) {
        const banner = req.files["banner"][0];
        if (bannerId === null) {
          const bannerResponse = await prisma.media.create({
            data: {
              url: req.bannerLocation,
              type: banner.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          bannerId = bannerResponse.id;
        } else {
          await deleteMediaFromCloud(
            existArtikel.banner.url.replace(`${process.env.AWS_URL_IMG}/`, "")
          );
          const bannerResponse = await prisma.media.update({
            where: { id: parseInt(bannerId) },
            data: {
              url: req.bannerLocation,
              type: banner.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          bannerId = bannerResponse.id;
        }
      }

      // Menyimpan data media baru
      const newMediaData =
        files.length > 0
          ? files.map((file, index) => ({
              url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;

      await artikelRepository.updateArtikel(id, {
        title,
        bannerId,
        description,
        status,
        type,
        category,
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
