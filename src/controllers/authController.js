const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");
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

class AuthController {
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
      const existingUser = await authRepository.findUserById(parseInt(id));
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

  async registerStudent(req, res) {
    const {
      password = "12345678",
      name,
      birthPlace,
      address,
      phone,
      email,
      gender,
      nis,
      nisn,
      startYear,
    } = req.body;

    try {
      const existingUser = await authRepository.findUserByUsername(nis);
      if (existingUser) {
        return res
          .status(400)
          .json({ status: 400, message: "NIS already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await authRepository.createUser({
        username: nis,
        password: hashedPassword,
        roles: { create: { name: "STUDENT" } },
        students: {
          create: {
            name,
            birthPlace,
            address,
            email,
            gender,
            nis,
            nisn,
            phone,
            startYear: new Date(startYear),
          },
        },
      });

      res
        .status(201)
        .json({ status: 201, message: "Student registered successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async registerStaff(req, res) {
    const {
      password = "12345678",
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

    try {
      const existingUser = await authRepository.findUserByUsername(nip);
      if (existingUser) {
        return res
          .status(400)
          .json({ status: 400, message: "NIP already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await authRepository.createUser({
        username: nip,
        password: hashedPassword,
        roles: { create: { name: role } },
        staff: {
          create: {
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
            startDate: new Date(startDate),
          },
        },
      });

      res
        .status(201)
        .json({ status: 201, message: "Staff registered successfully" });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await authRepository.findUserByUsername(username);
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      let name;
      let photo = "";
      if (user.staff && user.staff.length > 0) {
        name = user.staff[0].name;
        photo = user.staff[0].photo?.url || "";
      } else if (user.students && user.students.length > 0) {
        name = user.students[0].name;
        photo = user.students[0].photo?.url || "";
      } else {
        name = null;
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          name: name,
          roles: user.roles[0].name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      const userToSend = {
        name: name,
        photo: photo,
        role: user.roles[0].name,
      };

      res.status(200).json({
        status: 200,
        message: "Login successful",
        token,
        user: userToSend,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, message: "Internal server error", error });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(400).json({ message: "No token provided" });
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid token" });
        }
        res.status(200).json({ status: 200, valid: true, user: decoded });
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
