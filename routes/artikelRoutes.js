const express = require("express");
const artikelController = require("../controllers/artikelController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = artikelController.uploadFiles();
const compressMedia = artikelController.compressAndUpload;

router.get("/get", artikelController.getAllArtikel);
router.get("/get/:id", artikelController.getArtikelById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, artikelController.createArtikel);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, artikelController.updateArtikel);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), artikelController.deleteArtikelById);

module.exports = router;
