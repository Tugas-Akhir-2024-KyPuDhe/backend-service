const staffRepository = require("../repositories/staffRepository");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const { storage, s3Client } = require("../config/awsClound");

class StaffController {
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
      const existingUser = await staffRepository.findUserById(parseInt(id));
      if (existingUser.staff.length > 0) {
        const staffMember = existingUser.staff[0];
        sanitizedTitle =
          staffMember.nip && staffMember.name
            ? `staff_${staffMember.nip}_${staffMember.name
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9_]/g, "")}`
            : "default";
      } else if (existingUser.staffs.length > 0) {
        const staff = existingUser.staffs[0];
        sanitizedTitle =
          staff.nis && staff.name
            ? `siswa_${staff.nis}_${staff.name
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

  async getStaffByUsername(req, res) {
    const { nip } = req.params;

    try {
      const staff = await staffRepository.findStaffByNip(nip);

      if (!staff) {
        return res
          .status(404)
          .json({ status: 404, message: "Staff not found" });
      }

      res.status(200).json({
        status: 200,
        message: "Staff retrieved successfully",
        data: staff,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async getStaff(req, res) {
    try {
      let tipeUser = req.query.tipe || "";
      tipeUser = tipeUser.toLowerCase();

      const teacher = await staffRepository.getAllStaff(tipeUser);

      if (!teacher) {
        return res
          .status(404)
          .json({ status: 404, message: "Staff not found" });
      }

      res.status(200).json({
        status: 200,
        message: "Staff retrieved successfully",
        data: teacher,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }


}

module.exports = new StaffController();
