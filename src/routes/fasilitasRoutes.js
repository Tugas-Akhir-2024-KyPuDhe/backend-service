const express = require("express");
const fasilitasController = require("../controllers/fasilitasController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = fasilitasController.uploadFiles();
const compressMedia = fasilitasController.compressAndUpload;

router.get("/get", fasilitasController.getAllFasilitas);
router.get("/get/:id", fasilitasController.getFasilitasById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, fasilitasController.updateFasilitas);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), fasilitasController.deleteFasilitasById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, fasilitasController.createFasilitas);

module.exports = router;
