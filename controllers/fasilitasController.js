const fasilitasRepository = require("../repositories/fasilitasRepository");
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

class FasilitasController {
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

  async getAllFasilitas(req, res) {
    try {
      const response = await fasilitasRepository.getAllFasilitas();
      res.status(200).json({ status: 200, message: "Successfully retrieved all Facility.", data: response });
    } catch (error) {
      res.status(500).json({ status: 500, message: "Failed to retrieve facility due to internal server error.", error });
    }
  }

  async getFasilitasById(req, res) {
    try {
      const { id } = req.params;
      const response = await fasilitasRepository.findFasilitasById(
        parseInt(id)
      );
      if (!response)
        return res.status(404).json({ status: 404, message: "Facility not found. The provided ID does not match any records." });

      res.status(200).json({ status: 200, message: "Successfully retrieved the facility.", data: response });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to retrieve facility due to error: ${error.message}`,
      });
    }
  }

  async deleteFasilitasById(req, res) {
    try {
      const { id } = req.params;
      const existFasilitas = await fasilitasRepository.findFasilitasById(
        parseInt(id)
      );
      if (!existFasilitas)
        return res.status(404).json({ status: 400, message: "Facility not found. Cannot delete a non-existing facility." });

      await fasilitasRepository.deleteFasilitas(parseInt(id));

      return res.status(200).json({ status: 200, message: "Facility deleted successfully." });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to delete facility due to error: ${error.message}`,
      });
    }
  }

  async createFasilitas(req, res, next) {
    try {
      const { name, description, prioritas } = req.body;
      const files = req.files ? req.files["media"] : [];

      const mediaUrls = files.map((file, index) => ({
        url: `https://dummyurl.com/media/fasilitas/${myfunc.fileName(
          name
        )}-${myfunc.getRandomDigit(4)}.jpg`,
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      fasilitasRepository.createFasilitas({
        name,
        description,
        prioritas,
        media: {
          create: mediaUrls,
        },
      });

      return res.status(201).json({ status: 201, message: "Facility successfully added" });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to create facility due to error: ${error.message}`,
      });
    }
  }

  async updateFasilitas(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files["media"];

      const newMediaData = files
        ? files.map((file) => ({
            url: `https://dummyurl.com/media/fasilitas/${myfunc.fileName(
              name
            )}-${myfunc.getRandomDigit(4)}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];
      await fasilitasRepository.updateFasilitas(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData,
      });

      return res.status(200).json({
        status: 201,
        message: "Facility successfully updated",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: `Failed to update facility due to error: ${error.message}`,
      });
    }
  }
}

module.exports = new FasilitasController();
