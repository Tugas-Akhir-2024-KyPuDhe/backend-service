const jurusanRepository = require("../repositories/jurusanRepository");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { storage, s3Client } = require("../config/awsClound");
class JurusanController {
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
              let mediaKey = `jurusan/media_${sanitizedTitle}_${Date.now()}`;

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

  async getAllJurusan(req, res) {
    try {
      const response = await jurusanRepository.getAllJurusan();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all Major.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve major due to internal server error.",
        error,
      });
    }
  }

  async getJurusanById(req, res) {
    try {
      const { id } = req.params;
      const response = await jurusanRepository.findJurusanById(parseInt(id));
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "Major not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the major.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve major due to error: ${error.message}`,
      });
    }
  }

  async deleteJurusanById(req, res) {
    try {
      const { id } = req.params;
      const existJurusan = await jurusanRepository.findJurusanById(
        parseInt(id)
      );
      if (!existJurusan)
        return res.status(404).json({
          status: 404,
          message: "Major not found. Cannot delete a non-existing major.",
        });

      await jurusanRepository.deleteJurusan(parseInt(id));

      return res
        .status(200)
        .json({ status: 200, message: "Major deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete major due to error: ${error.message}`,
      });
    }
  }

  async createJurusan(req, res, next) {
    try {
      const { name, majorCode, description, prioritas } = req.body;
      const mediaFiles = req.files?.["media"] || [];
      const mediaUrls = mediaFiles.map((file, index) => ({
        url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      await jurusanRepository.createJurusan({
        name,
        majorCode,
        description,
        prioritas: parseInt(prioritas),
        media: {
          create: mediaUrls,
        },
      });

      return res
        .status(201)
        .json({ status: 201, message: "Major successfully created." });
    } catch (error) {
      next(error);
    }
  }

  async updateJurusan(req, res) {
    try {
      const { id } = req.params;
      const { name, majorCode, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files?.["media"] || [];

      const existJurusan = await jurusanRepository.findJurusanById(
        parseInt(id)
      );
      if (!existJurusan) {
        return res.status(404).json({
          status: 400,
          message: "Jurusan not found. Unable to update non-existing jurusan.",
        });
      }

      const newMediaData =
        files.length > 0
          ? files.map((file, index) => ({
              url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;
          

      await jurusanRepository.updateJurusan(id, {
        name,
        majorCode,
        description,
        prioritas: parseInt(prioritas),
        mediaIdsToDelete,
        newMediaData: newMediaData || undefined,
      });

      return res.status(200).json({
        status: 200,
        message: "Jurusan successfully updated",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new JurusanController();
