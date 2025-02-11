const problemReportRepository = require("../repositories/problemReportRepository");
const prisma = require("../config/database");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const {
  storage,
  s3Client,
  deleteMediaFromCloud,
} = require("../config/awsClound");

class ProblemReportController {
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
    }).fields([{ name: "media", maxCount: 1 }]);
  }

  async compressAndUpload(req, res, next) {
    try {
      const { IdName } = req.body;
      const sanitizedTitle = IdName
        ? title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : "default";

      if (req.files) {
        if (req.files["media"]) {
          const banner = req.files["media"][0];
          let bannerBuffer = banner.buffer;
          let bannerKey = `problemReport/report_${sanitizedTitle}_${Date.now()}`;

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

          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: bannerKey,
              Body: bannerBuffer,
              ACL: "public-read",
              ContentType: banner.mimetype,
            })
          );

          req.mediaLocation = `${process.env.AWS_URL_IMG}/${bannerKey}`;
        }
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `File processing error: ${error.message}` });
    }
  }

  async getAllProblemReport(req, res) {
    try {
      const response = await problemReportRepository.getAllProblemReport();
      res.status(200).json({
        status: 200,
        message: "Problem Report retrieved successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getProblemReportById(req, res) {
    try {
      const { id } = req.params;
      const response = await problemReportRepository.findProblemReportById(
        parseInt(id)
      );
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "Problem Report not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the problem report.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve problem report due to error: ${error.message}`,
      });
    }
  }

  async deleteProblemReportById(req, res) {
    try {
      const { id } = req.params;
      const existProblemReport =
        await problemReportRepository.findProblemReportById(parseInt(id));
      if (!existProblemReport) {
        return res.status(404).json({
          status: 404,
          message: `Problem Report with ID ${id} not found`,
        });
      }

      await problemReportRepository.deleteProblemReport(parseInt(id));

      return res.status(200).json({
        status: 200,
        message: `problem Report with ID ${id} successfully deleted`,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async createProblemReport(req, res) {
    try {
      const { createdBy, idName, pageProblem, problemDescription, telp } =
        req.body;
      let mediaId = null;

      if (req.mediaLocation) {
        const mediaResponse = await prisma.media.create({
          data: {
            url: req.mediaLocation,
            type: "image",
          },
        });
        mediaId = mediaResponse.id;
      }

      await problemReportRepository.createProblemReport({
        createdBy,
        idName,
        pageProblem,
        problemDescription,
        telp,
        mediaId: mediaId,
      });

      return res.status(201).json({
        status: 201,
        message: "Problem Report successfully created",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateProblemReport(req, res) {}
}

module.exports = new ProblemReportController();
