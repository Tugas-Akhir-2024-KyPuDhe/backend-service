const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
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

class UserController {
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
      const existingUser = await userRepository.findUserById(parseInt(id));
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

  async getUser(req, res) {
    const { token } = req.params;
    try {
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await userRepository.findUserByUsername(decoded.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userRole = user.roles.length > 0 ? user.roles[0].name : null;
      const userData = {
        role: userRole,
        details: null,
      };

      if (
        userRole === "STAFF" ||
        (userRole === "TEACHER" && user.staff.length > 0)
      ) {
        userData.details = user.staff;
      } else if (userRole === "STUDENT" && user.students.length > 0) {
        userData.details = user.students;
      }

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved detail user",
        user: userData,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async getUsers(req, res) {
    try {
      let tipeUser = req.query.tipe || "staff";
      tipeUser = tipeUser.toLowerCase();

      if (tipeUser !== "staff" && tipeUser !== "student") {
        return res.status(404).json({
          status: 404,
          message: "User type not found",
        });
      }

      const users = await userRepository.getAllUser(tipeUser);

      res.status(200).json({
        status: 200,
        message: "User retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    const { password, birthPlace, address, phone, email } = req.body;
    let id = null;
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ status: 401, message: "Invalid token" });
        }
        id = decoded.id;
      });

      const existingUser = await userRepository.findUserById(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let updateData = {};

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      if (existingUser.staff.length > 0) {
        updateData.staff = {
          update: {
            where: { id: existingUser.staff[0].id },
            data: {
              birthPlace,
              address,
              phone,
              email,
            },
          },
        };
      } else if (existingUser.students.length > 0) {
        updateData.students = {
          update: {
            where: { id: existingUser.students[0].id },
            data: {
              birthPlace,
              address,
              phone,
              email,
            },
          },
        };
      }
      await userRepository.updateUser(id, updateData);

      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async updatePhotoUser(req, res) {
    try {
      const { id } = req.params;
      // Find the user by ID
      const existingUser = await userRepository.findUserById(parseInt(id));
      if (!existingUser) {
        return res.status(404).json({
          status: 404,
          message: "User not found. Unable to update non-existing user.",
        });
      }

      let photoId = null;
      if (existingUser.staff.length > 0 && existingUser.staff[0].photo) {
        photoId = existingUser.staff[0].mediaId;
      } else if (
        existingUser.students.length > 0 &&
        existingUser.students[0].photo
      ) {
        photoId = existingUser.students[0].mediaId;
      }

      // Check if a new photo was uploaded
      if (req.photoLocation && req.files && req.files["photo"]) {
        const photo = req.files["photo"][0];
        const isImage = photo.mimetype.startsWith("image");

        if (!photoId) {
          // Create a new media entry if the user doesn't have an existing photo
          const photoResponse = await prisma.media.create({
            data: {
              url: req.photoLocation,
              type: isImage ? "image" : "video",
            },
          });
          photoId = photoResponse.id;
        } else {
          // Update the media record with the new photo details
          const photoResponse = await prisma.media.update({
            where: { id: parseInt(photoId) },
            data: {
              url: req.photoLocation,
              type: isImage ? "image" : "video",
            },
          });
          photoId = photoResponse.id;
        }
      }

      // Prepare the update data based on the user type
      let updateData = {};
      if (existingUser.staff.length > 0) {
        if (existingUser.staff[0].photo) {
          await deleteMediaFromCloud(
            existingUser.staff[0].photo.url.replace(
              `${process.env.AWS_URL_IMG}/`,
              ""
            )
          );
        }
        updateData.staff = {
          update: {
            where: { id: existingUser.staff[0].id },
            data: { mediaId: photoId },
          },
        };
      } else if (existingUser.students.length > 0) {
        if (existingUser.students[0].photo) {
          await deleteMediaFromCloud(
            existingUser.students[0].photo.url.replace(
              `${process.env.AWS_URL_IMG}/`,
              ""
            )
          );
        }
        updateData.students = {
          update: {
            where: { id: existingUser.students[0].id },
            data: { mediaId: photoId },
          },
        };
      }

      // Update the user record with the new photo ID
      const updatedUser = await userRepository.updateUser(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({
          status: 404,
          message: `User with ID ${id} not found`,
        });
      }

      // Success response
      return res.status(200).json({
        status: 200,
        message: `User with ID ${id} photo updated successfully`,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
