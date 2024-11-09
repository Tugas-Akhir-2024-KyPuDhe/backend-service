const fasilitasRepository = require("../repositories/fasilitasRepository");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const storage = multer.memoryStorage();

class FasilitasController {
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
      const { name } = req.body;
      const sanitizedTitle = name
        ? name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : "default";

      if (req.files) {
        if (req.files["media"]) {
          req.mediaLocations = await Promise.all(
            req.files["media"].map(async (file) => {
              let fileBuffer = file.buffer;
              let mediaKey = `fasilitas/media_${sanitizedTitle}_${Date.now()}`;

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

              await s3Client.send(
                new PutObjectCommand({
                  Bucket: process.env.AWS_BUCKET_NAME,
                  Key: mediaKey,
                  Body: fileBuffer,
                  ACL: "public-read",
                  ContentType: file.mimetype,
                })
              );

              return {
                url: `${process.env.AWS_URL_IMG}/${mediaKey}`,
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

  async getAllFasilitas(req, res) {
    try {
      const response = await fasilitasRepository.getAllFasilitas();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all facilities.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve facilities due to internal server error.",
        error,
      });
    }
  }

  async getFasilitasById(req, res) {
    try {
      const { id } = req.params;
      const response = await fasilitasRepository.findFasilitasById(
        parseInt(id)
      );
      if (!response) {
        return res.status(404).json({
          status: 404,
          message:
            "Facility not found. The provided ID does not match any records.",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the facility.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve facility due to error: ${error.message}`,
      });
    }
  }

  async deleteFasilitasById(req, res) {
    try {
      const { id } = req.params;
      const existFasilitas = await fasilitasRepository.findFasilitasById(
        parseInt(id)
      );
      if (!existFasilitas) {
        return res.status(404).json({
          status: 404,
          message: "Facility not found. Cannot delete a non-existing facility.",
        });
      }

      await fasilitasRepository.deleteFasilitas(parseInt(id));
      res
        .status(200)
        .json({ status: 200, message: "Facility deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete facility due to error: ${error.message}`,
      });
    }
  }

  async createFasilitas(req, res) {
    try {
      const { name, description, prioritas } = req.body;
      const mediaFiles = req.files?.["media"] || [];
      const mediaUrls = mediaFiles.map((file, index) => ({
        url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      await fasilitasRepository.createFasilitas({
        name,
        description,
        prioritas: parseInt(prioritas),
        media: {
          create: mediaUrls,
        },
      });

      return res
        .status(201)
        .json({ status: 201, message: "Facility successfully added" });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: `Failed to create facility due to error: ${error.message}`,
      });
    }
  }

  async updateFasilitas(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files?.["media"] || [];

      const existFasilitas = await fasilitasRepository.findFasilitasById(
        parseInt(id)
      );
      if (!existFasilitas) {
        return res.status(404).json({
          status: 400,
          message:
            "Fasilitas not found. Unable to update non-existing fasilitas.",
        });
      }

      const newMediaData =
        files.length > 0
          ? files.map((file) => ({
              url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;

      await fasilitasRepository.updateFasilitas(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData: newMediaData || undefined,
      });

      return res.status(200).json({
        status: 200,
        message: "Facility successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update facility due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new FasilitasController();
