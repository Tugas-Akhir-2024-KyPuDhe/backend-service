const jurusanRepository = require("../repositories/jurusanRepository");
const multer = require("multer");
const myFunctions = require("../utils/functions");

class JurusanController {
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
      res.status(400).json({ status: 400, message: error.message });
    }
  }

  async createJurusan(req, res) {
    try {
      const { name, description, prioritas } = req.body;
      const files = req.files;

      const mediaUrls = files
        ? files.map((file, index) => ({
            url: `https://dummyurl.com/media/${name}-${myFunctions.getRandomDigit(
              4
            )}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];

      await jurusanRepository.createJurusan({
        name,
        description,
        prioritas,
        media: {
          create: mediaUrls,
        },
      });

      return res.status(201).json({ message: "Jurusan successfully added" });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  }

  async updateJurusan(req, res) {
    try {
      const { id } = req.params;
      const { name, description, prioritas, mediaIdsToDelete } = req.body;
      const files = req.files;

      // Prepare new media files, if any
      const newMediaData = files
        ? files.map((file) => ({
            url: `https://dummyurl.com/media/${name}-${myFunctions.getRandomDigit(
              4
            )}`,
            type: file.mimetype.startsWith("image") ? "image" : "video",
          }))
        : [];
      const updatedJurusan = await jurusanRepository.updateJurusan(id, {
        name,
        description,
        prioritas,
        mediaIdsToDelete,
        newMediaData,
      });

      return res.status(200).json({
        status: 200,
        message: "Jurusan successfully updated",
      });
    } catch (error) {
      res.status(400).json({ status: 400, message: error.message });
    }
  }
}

module.exports = new JurusanController();
