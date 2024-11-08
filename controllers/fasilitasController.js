const fasilitasRepository = require("../repositories/fasilitasRepository");
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
    const filename = `fasilitas/${sanitizedTitle}-${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});

class FasilitasController {
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
      const files = req.files?.["media"] || [];

      const mediaUrls =
        files.length > 0
          ? files.map((file) => ({
              url: file.location,
              type: file.mimetype.startsWith("image") ? "image" : "video",
            }))
          : [];

      const fasilitasData = {
        name,
        description,
        prioritas: parseInt(prioritas),
      };

      if (mediaUrls.length > 0) {
        fasilitasData.media = { create: mediaUrls };
      }

      await fasilitasRepository.createFasilitas(fasilitasData);

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
      const files = req.files ? req.files["media"] : [];

      const newMediaData = files.map((file) => ({
        url: file.location,
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      await fasilitasRepository.updateFasilitas(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData,
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
