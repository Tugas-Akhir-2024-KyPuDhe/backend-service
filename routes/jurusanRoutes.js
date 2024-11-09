const express = require("express");
const jurusanController = require("../controllers/jurusanController");
const router = express.Router();
const uploadFiles = jurusanController.uploadFiles();
const compressMedia = jurusanController.compressAndUpload;

router.get("/get", jurusanController.getAllJurusan);
router.get("/get/:id", jurusanController.getJurusanById);
router.put("/update/:id", uploadFiles, compressMedia, jurusanController.updateJurusan);
router.delete("/delete/:id", jurusanController.deleteJurusanById);
router.post("/store", uploadFiles, compressMedia, jurusanController.createJurusan);

module.exports = router;
