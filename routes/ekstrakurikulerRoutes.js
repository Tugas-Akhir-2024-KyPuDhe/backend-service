const express = require("express");
const ekstrakurikulerController = require("../controllers/ekstrakurikulerController");
const router = express.Router();
const uploadFiles = ekstrakurikulerController.uploadFiles();
const compressMedia = ekstrakurikulerController.compressAndUpload;

router.get("/get", ekstrakurikulerController.getAllEkstrakurikuler);
router.get("/get/:id", ekstrakurikulerController.getEkstrakurikulerById);
router.put("/update/:id", uploadFiles, compressMedia, ekstrakurikulerController.updateEkstrakurikuler);
router.delete("/delete/:id", ekstrakurikulerController.deleteEkstrakurikulerById);
router.post("/store", uploadFiles, compressMedia, ekstrakurikulerController.createEkstrakurikuler);

module.exports = router;
