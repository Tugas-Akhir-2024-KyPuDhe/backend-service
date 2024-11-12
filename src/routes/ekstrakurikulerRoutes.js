const express = require("express");
const ekstrakurikulerController = require("../controllers/ekstrakurikulerController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = ekstrakurikulerController.uploadFiles();
const compressMedia = ekstrakurikulerController.compressAndUpload;

router.get("/get", ekstrakurikulerController.getAllEkstrakurikuler);
router.get("/get/:id", ekstrakurikulerController.getEkstrakurikulerById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, ekstrakurikulerController.updateEkstrakurikuler);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), ekstrakurikulerController.deleteEkstrakurikulerById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, ekstrakurikulerController.createEkstrakurikuler);

module.exports = router;
