const bannerRepository = require("../repositories/bannerRepository");
const myfunc = require("../utils/functions");
const multer = require("multer");
const path = require("path");
const prisma = require('../config/database');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
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
      const files = req.files ? req.files["media"] : [];
      let bannerId = null;

      if (!title || !description) {
        return res.status(400).json({
          status: 400,
          message: "Title and description are required",
        });
      }

      if (req.files["media"]) {
        const banner = req.files["media"][0];
        // const bannerUrl = `https://dummyurl.com/media/banner/banner-${myfunc.fileName(
        //   title
        // )}-${myfunc.getRandomDigit(4)}`;
        const bannerUrl = `https://cdn.digitaldesa.com/uploads/landing/artikel/3aa66f51e6330230ba261fd5f454c4b7.jpg`;

        const bannerResponse = await prisma.media.create({
          data: {
            url: bannerUrl,
            type: banner.mimetype.startsWith("image") ? "image" : "video",
          },
        });
        bannerId = bannerResponse.id;
      }

      const mediaUrls = files.map((file) => ({
        // url: `https://dummyurl.com/media/banner/${myfunc.fileName(
        //   title
        // )}-${myfunc.getRandomDigit(4)}.jpg`,
        url: `https://cdn.digitaldesa.com/uploads/landing/artikel/3aa66f51e6330230ba261fd5f454c4b7.jpg`,
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      await bannerRepository.createBanner({
        title,
        description,
        bannerId: bannerId,
        prioritas: parseInt(prioritas),
        title_link,
        link,
        status,
        createdBy,
        banner: {
          create: mediaUrls,
        },
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
        prioritas,
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
