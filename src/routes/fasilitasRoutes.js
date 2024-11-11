const express = require("express");
const fasilitasController = require("../controllers/fasilitasController");
const router = express.Router();
const uploadFiles = fasilitasController.uploadFiles();
const compressMedia = fasilitasController.compressAndUpload;

router.get("/get", fasilitasController.getAllFasilitas);
router.get("/get/:id", fasilitasController.getFasilitasById);
router.put("/update/:id", uploadFiles, compressMedia, fasilitasController.updateFasilitas);
router.delete("/delete/:id", fasilitasController.deleteFasilitasById);
router.post("/store", uploadFiles, compressMedia, fasilitasController.createFasilitas);

module.exports = router;
