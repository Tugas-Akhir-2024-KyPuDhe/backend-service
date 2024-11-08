const ekstrakurikulerRepository = require("../repositories/ekstrakurikulerRepository");
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
    const filename = `ekstrakurikuler/${sanitizedTitle}-${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});

class EkstrakurikulerController {
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
    }).fields([{ name: "media", maxCount: 10 }]);
  }

  async getAllEkstrakurikuler(req, res) {
    try {
      const response = await ekstrakurikulerRepository.getAllEkstrakurikuler();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all ekstrakurikuler.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to retrieve ekstrakurikuler due to internal server error.",
        error,
      });
    }
  }

  async getEkstrakurikulerById(req, res) {
    try {
      const { id } = req.params;
      const response = await ekstrakurikulerRepository.findEkstrakurikulerById(
        parseInt(id)
      );
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "ekstrakurikuler not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the ekstrakurikuler.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve ekstrakurikuler due to error: ${error.message}`,
      });
    }
  }

  async deleteEkstrakurikulerById(req, res) {
    try {
      const { id } = req.params;
      const existEkstrakurikuler =
        await ekstrakurikulerRepository.findEkstrakurikulerById(parseInt(id));
      if (!existEkstrakurikuler)
        return res.status(404).json({
          status: 404,
          message:
            "Ekstrakurikuler not found. Cannot delete a non-existing ekstrakurikuler.",
        });

      await ekstrakurikulerRepository.deleteEkstrakurikuler(parseInt(id));

      return res.status(200).json({
        status: 200,
        message: "Ekstrakurikuler deleted successfully.",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createEkstrakurikuler(req, res, next) {
    try {
      const { name, description, prioritas } = req.body;
      const mediaFiles = req.files?.["media"] || [];
      const mediaUrls = mediaFiles.map((file) => ({
        url: file.location, // Lokasi file yang disimpan di S3
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      await ekstrakurikulerRepository.createEkstrakurikuler({
        name,
        description,
        prioritas: parseInt(prioritas),
        media: {
          create: mediaUrls,
        },
      });

      return res.status(201).json({
        status: 201,
        message: "Ekstrakurikuler successfully created.",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to create ekstrakurikuler due to error: ${error.message}`,
      });
    }
  }

  async updateEkstrakurikuler(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files?.["media"] || [];

      const existEkstrakurikuler =
        await ekstrakurikulerRepository.findEkstrakurikulerById(parseInt(id));
      if (!existEkstrakurikuler) {
        return res.status(404).json({
          status: 400,
          message:
            "Ekstrakurikuler not found. Unable to update non-existing ekstrakurikuler.",
        });
      }

      const newMediaData =
        files.length > 0
          ? files.map((file) => ({
              url: file.location,
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;

      await ekstrakurikulerRepository.updateEkstrakurikuler(id, {
        name,
        description,
        prioritas: parseInt(prioritas),
        mediaIdsToDelete,
        newMediaData: newMediaData || undefined,
      });

      return res.status(200).json({
        status: 200,
        message: "Ekstrakurikuler successfully updated.",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update ekstrakurikuler due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new EkstrakurikulerController();
