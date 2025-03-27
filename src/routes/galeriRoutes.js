const express = require("express");
const galeriController = require("../controllers/galeriController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = galeriController.uploadFiles();
const compressMedia = galeriController.compressAndUpload;

router.get("/get", galeriController.getAllGaleri);
router.get("/get/:id", galeriController.getGaleriById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, galeriController.updateGaleri);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), galeriController.deleteGaleriById);
router.delete("/delete/media/:mediaId", authMiddleware, authorizeRoles(['STAFF']), galeriController.deleteMediaById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, galeriController.createGaleri);

module.exports = router;
