const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const studentRepository = require("../repositories/studentRepository");
const prisma = require("../config/database");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { storage, s3Client } = require("../config/awsClound");

class StudentController {
  uploadFiles() {
    return multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4|avi|mov|webm/;
        const extname = fileTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        } else {
          return cb(
            new Error("Invalid file type. Only images are allowed."),
            false
          );
        }
      },
    }).fields([{ name: "photo", maxCount: 1 }]);
  }

  async compressAndUpload(req, res, next) {
    try {
      const { id } = req.params;
      let sanitizedTitle;
      const existingUser = await studentRepository.findUserById(parseInt(id));
      if (existingUser.staff.length > 0) {
        const staffMember = existingUser.staff[0];
        sanitizedTitle =
          staffMember.nip && staffMember.name
            ? `staff_${staffMember.nip}_${staffMember.name
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9_]/g, "")}`
            : "default";
      } else if (existingUser.students.length > 0) {
        const student = existingUser.students[0];
        sanitizedTitle =
          student.nis && student.name
            ? `siswa_${student.nis}_${student.name
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9_]/g, "")}`
            : "default";
      }

      if (req.files) {
        if (req.files["photo"]) {
          const photo = req.files["photo"][0];
          let photoBuffer = photo.buffer;
          let photoKey = `user/profil_${sanitizedTitle}_${Date.now()}`;

          if (
            photo.mimetype.startsWith("image") &&
            !photo.mimetype.includes("gif")
          ) {
            photoBuffer = await sharp(photoBuffer)
              .resize({ width: 800, height: 800 })
              .jpeg({ quality: 80 })
              .toBuffer();
            photoKey += ".jpg";
          } else {
            photoKey += path.extname(photo.originalname);
          }

          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: photoKey,
              Body: photoBuffer,
              ACL: "public-read",
              ContentType: photo.mimetype,
            })
          );

          req.photoLocation = `${process.env.AWS_URL_IMG}/${photoKey}`;
        }
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `File processing error: ${error.message}` });
    }
  }

  async getStudentByNis(req, res) {
    const { nis } = req.params;

    try {
      const student = await studentRepository.findStudentByNis(nis);
      if (!student) {
        return res
          .status(404)
          .json({ status: 404, message: "Student not found" });
      }

      res.status(200).json({
        status: 200,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async getAllStudents(req, res) {
    try {
      const { status = "all", major_code, grade } = req.query;

      const student = await studentRepository.getAllStudents(
        status,
        major_code,
        grade
      );

      if (!student) {
        return res
          .status(404)
          .json({ status: 404, message: "Student not found" });
      }

      res.status(200).json({
        status: 200,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async updateParentStudent(req, res) {
    const { nis } = req.params;
    const parentData = req.body;

    try {
      const student = await studentRepository.findStudentByNis(nis);

      if (!student) {
        return res
          .status(404)
          .json({ status: 404, message: "Student not found" });
      }

      const updatedParent = await studentRepository.updateParentOfStudent(
        parseInt(student.id),
        parentData
      );

      res.status(200).json({
        status: 200,
        message: "Parent data updated successfully",
        data: updatedParent,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getParentOfStudent(req, res) {
    const { nis } = req.query;

    if (!nis) {
      return res
        .status(404)
        .json({ status: 404, message: "nis student is required" });
    }

    try {
      const parent = await studentRepository.findParentStudentByNis(nis);

      if (!parent) {
        return res
          .status(404)
          .json({ status: 404, message: "parent of Student not found" });
      }

      res.status(200).json({
        status: 200,
        message: "Parent retrieved successfully",
        data: parent,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async getNewStudent(req, res) {
    try {
      const majorCode = req.query.majorCode;
      const student = await studentRepository.getAllNewStudent(majorCode);

      res.status(200).json({
        status: 200,
        message: "Student retrieved successfully",
        data: student,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }
}

module.exports = new StudentController();
