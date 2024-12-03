const configSchoolRepository = require("../repositories/configSchoolRepository");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const prisma = require("../config/database");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const {
  storage,
  s3Client,
  deleteMediaFromCloud,
} = require("../config/awsClound");

class ConfigShoolController {
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
      if (req.files) {
        if (req.files["media"]) {
          const media = req.files["media"][0];
          let mediaBuffer = media.buffer;
          let logoKey = `assets/logo_${Date.now()}`;

          if (
            media.mimetype.startsWith("image") &&
            !media.mimetype.includes("gif")
          ) {
            mediaBuffer = await sharp(mediaBuffer)
              .resize({ width: 800 })
              .png({ quality: 80 })
              .toBuffer();
            logoKey += ".png";
          } else {
            logoKey += path.extname(media.originalname);
          }

          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: logoKey,
              Body: mediaBuffer,
              ACL: "public-read",
              ContentType: media.mimetype,
            })
          );

          req.mediaLocation = `${process.env.AWS_URL_IMG}/${logoKey}`;
        }
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `File processing error: ${error.message}` });
    }
  }

  async getConfigSchool(req, res) {
    try {
      const responseConfig = await configSchoolRepository.getConfigSchool();
      res
        .status(200)
        .json({ status: 200, message: "success", data: responseConfig });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async getStatistik(req, res) {
    try {
      const student = await configSchoolRepository.countStudent();
      const teacher = await configSchoolRepository.countTeacher();
      const staff = await configSchoolRepository.countStaff();
      const major = await configSchoolRepository.countMajor();
      const data = {
        student,
        teacher,
        staff,
        major,
        alumni: 381,
      };
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the statistik.",
        data: data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async updateConfigSchool(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        about,
        vision,
        mission,
        address,
        telp,
        email,
        npsn,
        fb,
        ig,
        tiktok,
      } = req.body;
      let mediaId = null;

      const existConfig = await configSchoolRepository.findConfigById(
        parseInt(id)
      );

      if (!existConfig) {
        return res.status(404).json({
          status: 400,
          message: "Config not found. Unable to update non-existing config.",
        });
      }

      mediaId = existConfig.mediaId;

      if (req.mediaLocation) {
        const logo = req.files["media"][0];
        if (mediaId === null) {
          const logoResponse = await prisma.media.create({
            data: {
              url: req.mediaLocation,
              type: logo.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          mediaId = logoResponse.id;
        } else {
          await deleteMediaFromCloud(
            existConfig.logo.url.replace(`${process.env.AWS_URL_IMG}/`, "")
          );
          const logoResponse = await prisma.media.update({
            where: { id: parseInt(mediaId) },
            data: {
              url: req.mediaLocation,
              type: logo.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          mediaId = logoResponse.id;
        }
      }
      await configSchoolRepository.updateConfigSchool(id, {
        name,
        about,
        vision,
        mission,
        address,
        mediaId,
        telp,
        email,
        npsn,
        fb,
        ig,
        tiktok,
      });
      res
        .status(200)
        .json({ status: 200, message: "update config school successfuly" });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error,
      });
    }
  }

  async updateLogoConfigSchool(req, res) {
    try {
      const { id } = req.params;
      let mediaId = null;

      const existConfig = await configSchoolRepository.findConfigById(
        parseInt(id)
      );

      if (!existConfig) {
        return res.status(404).json({
          status: 400,
          message: "Config not found. Unable to update non-existing config.",
        });
      }

      mediaId = existConfig.mediaId;

      if (req.mediaLocation) {
        const logo = req.files["media"][0];
        if (mediaId === null) {
          const logoResponse = await prisma.media.create({
            data: {
              url: req.mediaLocation,
              type: logo.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          mediaId = logoResponse.id;
        } else {
          await deleteMediaFromCloud(
            existConfig.logo.url.replace(`${process.env.AWS_URL_IMG}/`, "")
          );
          const logoResponse = await prisma.media.update({
            where: { id: parseInt(mediaId) },
            data: {
              url: req.mediaLocation,
              type: logo.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          mediaId = logoResponse.id;
        }
      }
      await configSchoolRepository.updateLogoConfigSchool(id, mediaId);
      res
        .status(200)
        .json({
          status: 200,
          message: "update logo config school successfuly",
        });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error,
      });
    }
  }
}

module.exports = new ConfigShoolController();
