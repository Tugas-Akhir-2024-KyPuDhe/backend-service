const bannerRepository = require("../repositories/bannerRepository");
const prisma = require("../config/database");
const myfunc = require("../utils/functions");
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
    const title = req.body.title || "default-title";
    const fileExtension = path.extname(file.originalname);
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `banner/${sanitizedTitle}-${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});


class BannerController {
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
    }).fields([{ name: "media", maxCount: 1 }]);
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

      if (req.files["media"]) {
        const banner = req.files["media"][0];
        const bannerUrl = banner.location;
        const bannerResponse = await prisma.media.create({
          data: {
            url: bannerUrl,
            type: banner.mimetype.startsWith("image") ? "image" : "video",
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
        mediaIdsToDelete,
      } = req.body;
      const files = req.files["media"];

      if (!title || !description) {
        return res.status(400).json({
          status: 400,
          message: "Title and description are required",
        });
      }

      const newMediaData = files
        ? files.map((file) => ({
            url: `https://dummyurl.com/media/banner/${myfunc.fileName(
              title
            )}-${myfunc.getRandomDigit(4)}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];

      const updatedBanner = await bannerRepository.updateBanner(id, {
        title,
        description,
        title_link,
        link,
        prioritas: parseInt(prioritas),
        status,
        mediaIdsToDelete,
        newMediaData,
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
