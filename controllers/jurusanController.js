const jurusanRepository = require("../repositories/jurusanRepository");
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
    const title = req.body.name || "default-title";
    const fileExtension = path.extname(file.originalname);
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `jurusan/${sanitizedTitle}-${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});

class JurusanController {
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
      const { name, description, prioritas } = req.body;
      const files = req.files ? req.files["media"] : [];

      const mediaUrls =
        files.length > 0
          ? files.map((file) => ({
              url: file.location,
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : [];

      const jurusanData = {
        name,
        description,
        prioritas: parseInt(prioritas),
      };

      if (mediaUrls.length > 0) {
        jurusanData.media = { create: mediaUrls };
      }

      await jurusanRepository.createJurusan(jurusanData);

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
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files?.["media"] || [];

      const existJurusan = await jurusanRepository.findJurusanById(
        parseInt(id)
      );
      if (!existJurusan) {
        return res.status(404).json({
          status: 400,
          message:
            "Jurusan not found. Unable to update non-existing jurusan.",
        });
      }

      const newMediaData =
        files.length > 0
          ? files.map((file) => ({
              url: file.location,
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : null;

      await jurusanRepository.updateJurusan(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData: newMediaData || undefined,
      });

      return res.status(200).json({
        message: "Jurusan successfully updated",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new JurusanController();
