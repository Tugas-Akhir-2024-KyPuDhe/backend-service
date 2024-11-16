const galeriRepository = require("../repositories/galeriRepository");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { storage, s3Client } = require("../config/awsClound");
class GaleriController {
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
    }).fields([{ name: "media", maxCount: 10 }]);
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
              let mediaKey = `galeri/media_${sanitizedTitle}_${Date.now()}`;

              if (
                file.mimetype.startsWith("image") &&
                !file.mimetype.includes("gif")
              ) {
                fileBuffer = await sharp(fileBuffer)
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

  async getAllGaleri(req, res) {
    try {
      const response = await galeriRepository.getAllGaleri();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all galeri.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve galeri due to internal server error.",
        error,
      });
    }
  }

  async getGaleriById(req, res) {
    try {
      const { id } = req.params;
      const response = await galeriRepository.findGaleriById(parseInt(id));
      if (!response) {
        return res.status(404).json({
          status: 404,
          message:
            "Galeri not found. The provided ID does not match any records.",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the galeri.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve galeri due to error: ${error.message}`,
      });
    }
  }

  async deleteGaleriById(req, res) {
    try {
      const { id } = req.params;
      const existGaleri = await galeriRepository.findGaleriById(parseInt(id));
      if (!existGaleri) {
        return res.status(404).json({
          status: 404,
          message: "Galeri not found. Cannot delete a non-existing galeri.",
        });
      }

      await galeriRepository.deleteGaleri(parseInt(id));
      res
        .status(200)
        .json({ status: 200, message: "Galeri deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete galeri due to error: ${error.message}`,
      });
    }
  }

  async createGaleri(req, res) {
    try {
      const { name, description, prioritas } = req.body;
      await galeriRepository.createGaleri({
        name,
        description,
        prioritas: parseInt(prioritas),
      });

      return res
        .status(201)
        .json({ status: 201, message: "Galeri successfully added" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: `Failed to create galeri due to error: ${error.message}`,
      });
    }
  }

  async updateGaleri(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, status, mediaIdsToDelete } = req.body;
      const files = req.files?.["media"] || [];

      const existGaleri = await galeriRepository.findGaleriById(parseInt(id));
      if (!existGaleri) {
        return res.status(404).json({
          status: 400,
          message: "Galeri not found. Unable to update non-existing galeri.",
        });
      }
      
      const newMediaData =
        files.length > 0
          ? files.map((file, index) => ({
              url: req.mediaLocations[index].url, // Lokasi file yang disimpan di S3
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;

      await galeriRepository.updateGaleri(id, {
        name,
        description,
        prioritas,
        status,
        mediaIdsToDelete,
        newMediaData: newMediaData || undefined,
      });

      return res.status(200).json({
        status: 200,
        message: "Galeri successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update galeri due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new GaleriController();
