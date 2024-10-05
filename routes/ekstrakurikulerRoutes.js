const express = require("express");
const ekstrakurikulerController = require("../controllers/ekstrakurikulerController");
const router = express.Router();
const uploadFiles = ekstrakurikulerController.uploadFiles();

router.get("/get", ekstrakurikulerController.getAllEkstrakurikuler);
router.get("/get/:id", ekstrakurikulerController.getEkstrakurikulerById);
router.put("/update/:id", uploadFiles, ekstrakurikulerController.updateEkstrakurikuler);
router.delete("/delete/:id", ekstrakurikulerController.deleteEkstrakurikulerById);
router.post("/store", uploadFiles, ekstrakurikulerController.createEkstrakurikuler);

module.exports = router;
