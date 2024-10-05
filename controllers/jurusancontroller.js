const jurusanRepository = require("../repositories/jurusanRepository");
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

class JurusanController {
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

  async getAllJurusan(req, res) {
    try {
      const response = await jurusanRepository.getAllJurusan();
      res.status(200).json({ message: "success", data: response });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  async getJurusanById(req, res) {
    try {
      const { id } = req.params;
      const response = await jurusanRepository.findJurusanById(parseInt(id));
      if (!response)
        return res.status(404).json({ message: "Jurusan Not Found" });

      res.status(200).json({ message: "success", response });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteJurusanById(req, res) {
    try {
      const { id } = req.params;
      const existJurusan = await jurusanRepository.findJurusanById(
        parseInt(id)
      );
      if (!existJurusan)
        return res.status(404).json({ message: "Jurusan Not Found" });

      await jurusanRepository.deleteJurusan(parseInt(id));

      return res.status(200).json({ message: "delete successfuly" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createJurusan(req, res, next) {
    try {
      const { name, description, prioritas } = req.body;
      const files = req.files ? req.files["media"] : [];

      const mediaUrls = files.map((file, index) => ({
        url: `https://dummyurl.com/media/jurusan/${myfunc.fileName(
          name
        )}-${myfunc.getRandomDigit(4)}.jpg`,
        type: file.mimetype.startsWith("image") ? "image" : "video",
      }));

      jurusanRepository.createJurusan({
        name,
        description,
        prioritas,
        media: {
          create: mediaUrls,
        },
      });

      return res.status(201).json({ message: "Jurusan successfully added" });
    } catch (error) {
      next(error);
    }
  }

  async updateJurusan(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files["media"];

      const newMediaData = files
        ? files.map((file) => ({
            url: `https://dummyurl.com/media/jurusan/${myfunc.fileName(
              name
            )}-${myfunc.getRandomDigit(4)}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];
      await jurusanRepository.updateJurusan(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData,
      });

      return res.status(200).json({
        message: "Jurusan successfully updated",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new JurusanController();
