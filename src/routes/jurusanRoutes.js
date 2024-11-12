const express = require("express");
const jurusanController = require("../controllers/jurusanController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = jurusanController.uploadFiles();
const compressMedia = jurusanController.compressAndUpload;

router.get("/get", jurusanController.getAllJurusan);
router.get("/get/:id", jurusanController.getJurusanById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, jurusanController.updateJurusan);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), jurusanController.deleteJurusanById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, jurusanController.createJurusan);

module.exports = router;
