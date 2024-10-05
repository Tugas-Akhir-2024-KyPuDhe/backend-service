const express = require("express");
const fasilitasController = require("../controllers/fasilitasController");
const router = express.Router();
const uploadFiles = fasilitasController.uploadFiles();

router.get("/get", fasilitasController.getAllFasilitas);
router.get("/get/:id", fasilitasController.getFasilitasById);
router.put("/update/:id", uploadFiles, fasilitasController.updateFasilitas);
router.delete("/delete/:id", fasilitasController.deleteFasilitasById);
router.post("/store", uploadFiles, fasilitasController.createFasilitas);

module.exports = router;
