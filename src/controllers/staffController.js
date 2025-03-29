const staffRepository = require("../repositories/staffRepository");
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
      const { nip, name } = req.body;
      let sanitizedTitle;
      sanitizedTitle =
        nip && name
          ? `staff_${nip}_${name
              .replace(/\s+/g, "_")
              .replace(/[^a-zA-Z0-9_]/g, "")}`
          : "default";

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

  async getClassTeacher(req, res) {
    const { nip, id = "" } = req.query;

    try {
      if (id) {
        const courseInClass = await staffRepository.findCourseInClassById(parseInt(id));
        if (!courseInClass) {
          return res
            .status(404)
            .json({ status: 404, message: "Class not found" });
        }
      }
      const classStaff = await staffRepository.findClassByNip(nip, id);

      res.status(200).json({
        status: 200,
        message: "Class Staff retrieved successfully",
        data: classStaff,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async getClassRoomTeacher(req, res) {
    const { id } = req.query;

    try {
      const staff = await staffRepository.findStaffById(parseInt(id));

      if (!staff) {
        return res
          .status(404)
          .json({ status: 404, message: "Staff not found" });
      }

      const classStaff = await staffRepository.findClassRoomTeacherByNip(parseInt(id));

      res.status(200).json({
        status: 200,
        message: "Class room Staff retrieved successfully",
        data: classStaff,
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

  async updateUserStaff(req, res) {
    const { id } = req.params;
    const {
      name,
      birthPlace,
      address,
      phone,
      email,
      gender,
      mapel,
      nip,
      type,
      position,
      startDate,
      role,
    } = req.body;
    let mediaId = null;
    const mapelArray = mapel.split(",").map((item) => item.trim());

    try {
      const existingUserStaff = await staffRepository.findStaffById(
        parseInt(id)
      );
      if (!existingUserStaff) {
        return res.status(404).json({ message: "User Staff not found" });
      }

      mediaId = existingUserStaff.mediaId;
      if (req.photoLocation) {
        const photo = req.files["photo"][0];
        if (mediaId === null) {
          const mediaResponse = await prisma.media.create({
            data: {
              url: req.photoLocation,
              type: photo.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          mediaId = mediaResponse.id;
        } else {
          await deleteMediaFromCloud(
            existingUserStaff.photo.url.replace(
              `${process.env.AWS_URL_IMG}/`,
              ""
            )
          );
          const mediaResponse = await prisma.media.update({
            where: { id: parseInt(mediaId) },
            data: {
              url: req.photoLocation,
              type: photo.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          mediaId = mediaResponse.id;
        }
      }

      // Update data user (role jika diperlukan)
      if (role && role !== existingUserStaff.user.roles[0]?.name) {
        await prisma.role.updateMany({
          where: {
            userId: existingUserStaff.user.id,
          },
          data: { name: role },
        });
      }

      const userData = {
        username: nip,
      };

      if (role && role !== existingUserStaff.user.roles[0]?.name) {
        userData.roles = {
          update: {
            name: role,
          },
        };
      }

      const staffData = {
        name,
        birthPlace,
        address,
        phone,
        email,
        gender,
        mapel: mapelArray,
        nip,
        type,
        position,
        startDate: startDate
          ? new Date(startDate)
          : existingUserStaff.startDate,
        mediaId,
      };

      await staffRepository.updateStaff(id, staffData);

      if (existingUserStaff.nip != nip) {
        await staffRepository.updateUserStaff(id, { username: nip });
      }

      res
        .status(200)
        .json({ status: 200, message: "User Staff updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }
}

module.exports = new StaffController();
