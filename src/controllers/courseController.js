const courseRepository = require("../repositories/courseRepository");
const prisma = require("../config/database");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { storage, s3Client, deleteMediaFromCloud } = require("../config/awsClound");
class CourseController {
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
      const { name } = req.body;
      const sanitizedTitle = name
        ? name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : "default";

      if (req.files) {
        if (req.files["media"]) {
          req.mediaLocations = await Promise.all(
            req.files["media"].map(async (file) => {
              let fileBuffer = file.buffer;
              let mediaKey = `course/media_${sanitizedTitle}_${Date.now()}`;

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

              req.mediaLocation = `${process.env.AWS_URL_IMG}/${mediaKey}`;
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

  async getAllCourse(req, res) {
    const { grade = "", status = "Active" } = req.query;
    try {
      const response = await courseRepository.getAllCourse(grade, status);
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all course.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve course due to internal server error.",
        error,
      });
    }
  }

  async getCourseById(req, res) {
    try {
      const { id } = req.params;
      const response = await courseRepository.findCourseById(parseInt(id));
      if (!response) {
        return res.status(404).json({
          status: 404,
          message:
            "Course not found. The provided ID does not match any records.",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the course.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve course due to error: ${error.message}`,
      });
    }
  }

  async deleteCourseById(req, res) {
    try {
      const { id } = req.params;
      const existCourse = await courseRepository.findCourseById(parseInt(id));
      if (!existCourse) {
        return res.status(404).json({
          status: 404,
          message: "Course not found. Cannot delete a non-existing course.",
        });
      }

      await courseRepository.deleteCourse(parseInt(id));
      res
        .status(200)
        .json({ status: 200, message: "Course deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete course due to error: ${error.message}`,
      });
    }
  }

  async createCourse(req, res) {
    try {
      const { name, code, grade, description } = req.body;
      let imageId = null;

      if (req.mediaLocation) {
        const courseResponse = await prisma.media.create({
          data: {
            url: req.mediaLocation,
            type: "image",
          },
        });
        imageId = courseResponse.id;
      }

      await courseRepository.createCourse({
        name,
        code,
        imageId: parseInt(imageId),
        grade,
        description,
      });

      return res.status(201).json({
        status: 201,
        message: "Course successfully created",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateCourse(req, res) {
    try {
      const { id } = req.params;
      const { name, code, grade, description, status } = req.body;
      let imageId = null;

      const existCourse = await courseRepository.findCourseById(parseInt(id));
      if (!existCourse) {
        return res.status(404).json({
          status: 400,
          message: "Course not found. Unable to update non-existing course.",
        });
      }

      imageId = existCourse.imageId;
      if (req.mediaLocation) {
        const imageCourse = req.files["media"][0];
        if (imageId === null) {
          const courseMediaResponse = await prisma.media.create({
            data: {
              url: req.mediaLocation,
              type: imageCourse.mimetype.startsWith("image")
                ? "image"
                : "video",
            },
          });
          imageId = courseMediaResponse.id;
        } else {
          await deleteMediaFromCloud(
            existCourse.image.url.replace(
              `${process.env.AWS_URL_IMG}/`,
              ""
            )
          );
          const courseMediaResponse = await prisma.media.update({
            where: { id: parseInt(imageId) },
            data: {
              url: req.mediaLocation,
              type: imageCourse.mimetype.startsWith("image")
                ? "image"
                : "video",
            },
          });
          imageId = courseMediaResponse.id;
        }
      }

      await courseRepository.updateCourse(id, {
        name,
        code,
        grade,
        description,
        status,
        imageId,
      });

      return res.status(200).json({
        status: 200,
        message: "Course successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update course due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new CourseController();
