const bannerRepository = require("../repositories/bannerRepository");
const prisma = require("../config/database");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.S3_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const storage = multer.memoryStorage(); 


class BannerController {
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
      const { title } = req.body;
      const sanitizedTitle = title
        ? title.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
        : "default";

      if (req.files) {
        if (req.files["media"]) {
          const banner = req.files["media"][0];
          let bannerBuffer = banner.buffer;
          let bannerKey = `banner/banner_${sanitizedTitle}_${Date.now()}`;

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

          req.bannerLocation = `${process.env.AWS_URL_IMG}/${bannerKey}`;
        }
      }
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: `File processing error: ${error.message}` });
    }
  }

  async getAllBanner(req, res) {
    try {
      const response = await bannerRepository.getAllBanner();
      res.status(200).json({
        status: 200,
        message: "Banners retrieved successfully",
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

  async getBannerById(req, res) {
    try {
      const { id } = req.params;
      const response = await bannerRepository.findBannerById(parseInt(id));
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "Banner not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the banner.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve banner due to error: ${error.message}`,
      });
    }
  }

  async deleteBannerById(req, res) {
    try {
      const { id } = req.params;
      const existBanner = await bannerRepository.findBannerById(parseInt(id));
      if (!existBanner) {
        return res.status(404).json({
          status: 404,
          message: `Banner with ID ${id} not found`,
        });
      }

      await bannerRepository.deleteBanner(parseInt(id));

      return res.status(200).json({
        status: 200,
        message: `Banner with ID ${id} successfully deleted`,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async createBanner(req, res, next) {
    try {
      const { title, description, prioritas, title_link, link, status, createdBy } =
        req.body;
      let bannerId = null;

      if (!title || !description) {
        return res.status(400).json({
          status: 400,
          message: "Title and description are required",
        });
      }

      if (req.bannerLocation) {
        const bannerResponse = await prisma.media.create({
          data: {
            url: req.bannerLocation,
            type: "image",
          },
        });
        bannerId = bannerResponse.id;
      }

      await bannerRepository.createBanner({
        title,
        description,
        bannerId: bannerId,
        prioritas: parseInt(prioritas),
        title_link,
        link,
        status,
        createdBy,
      });

      return res.status(201).json({
        status: 201,
        message: "Banner successfully created",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }

  async updateBanner(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        title_link,
        link,
        prioritas,
        status,
      } = req.body;

      const existBanner = await bannerRepository.findBannerById(
        parseInt(id)
      );
      if (!existBanner) {
        return res.status(404).json({
          status: 400,
          message:
            "Banner not found. Unable to update non-existing banner.",
        });
      }

      let bannerId = existBanner.bannerId || null;
      if (req.bannerLocation) {
        const banner = req.files["media"][0];
        if (bannerId == null) {
          const bannerResponse = await prisma.media.create({
            data: {
              url: req.bannerLocation,
              type: banner.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          bannerId = bannerResponse.id;
        } else {
          const bannerResponse = await prisma.media.update({
            where: { id: parseInt(bannerId) },
            data: {
              url: req.bannerLocation,
              type: banner.mimetype.startsWith("image") ? "image" : "video",
            },
          });
          bannerId = bannerResponse.id;
        }
      }

      const updatedBanner = await bannerRepository.updateBanner(id, {
        title,
        description,
        bannerId,
        title_link,
        link,
        prioritas: parseInt(prioritas),
        status,
      });

      if (!updatedBanner) {
        return res.status(404).json({
          status: 404,
          message: `Banner with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        status: 200,
        message: `Banner with ID ${id} successfully updated`,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  }
}

module.exports = new BannerController();
