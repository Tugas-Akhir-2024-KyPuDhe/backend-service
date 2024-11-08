const ekstrakurikuler = require("../repositories/ekstrakurikulerRepository");
const myfunc = require("../utils/functions");
const multer = require("multer");
const path = require("path");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

class EkstrakurikulerController {
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
    }).fields([{ name: "media", maxCount: 10 }]);
  }

  async getAllEkstrakurikuler(req, res) {
    try {
      const response = await ekstrakurikuler.getAllEkstrakurikuler();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all ekstrakurikuler.",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Failed to retrieve ekstrakurikuler due to internal server error.",
        error,
      });
    }
  }

  async getEkstrakurikulerById(req, res) {
    try {
      const { id } = req.params;
      const response = await ekstrakurikuler.findEkstrakurikulerById(
        parseInt(id)
      );
      if (!response)
        return res.status(404).json({
          status: 404,
          message:
            "ekstrakurikuler not found. The provided ID does not match any records.",
        });

      res.status(200).json({
        status: 200,
        message: "Successfully retrieved the ekstrakurikuler.",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve ekstrakurikuler due to error: ${error.message}`,
      });
    }
  }

  async deleteEkstrakurikulerById(req, res) {
    try {
      const { id } = req.params;
      const existEkstrakurikuler =
        await ekstrakurikuler.findEkstrakurikulerById(parseInt(id));
      if (!existEkstrakurikuler)
        return res.status(404).json({
          status: 404,
          message:
            "Ekstrakurikuler not found. Cannot delete a non-existing ekstrakurikuler.",
        });

      await ekstrakurikuler.deleteEkstrakurikuler(parseInt(id));

      return res
        .status(200)
        .json({
          status: 200,
          message: "Ekstrakurikuler deleted successfully.",
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createEkstrakurikuler(req, res, next) {
    try {
      const { name, description, prioritas } = req.body;
      const files = req.files ? req.files["media"] : [];

      const mediaUrls = files.map((file, index) => ({
        url: `https://dummyurl.com/media/ekstrakurikuler/${myfunc.fileName(
          name
        )}-${myfunc.getRandomDigit(4)}.jpg`,
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      ekstrakurikuler.createEkstrakurikuler({
        name,
        description,
        prioritas,
        media: {
          create: mediaUrls,
        },
      });

      return res
        .status(201)
        .json({
          status: 201,
          message: "Ekstrakurikuler successfully created.",
        });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to create ekstrakurikuler due to error: ${error.message}`,
      });
    }
  }

  async updateEkstrakurikuler(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files["media"];

      const newMediaData = files
        ? files.map((file) => ({
            url: `https://dummyurl.com/media/ekstrakurikuler/${myfunc.fileName(
              name
            )}-${myfunc.getRandomDigit(4)}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];
      await ekstrakurikuler.updateEkstrakurikuler(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData,
      });

      return res.status(200).json({
        status: 200,
        message: "Ekstrakurikuler successfully updated.",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update ekstrakurikuler due to error: ${error.message}`,
      })
    }
  }
}

module.exports = new EkstrakurikulerController();
