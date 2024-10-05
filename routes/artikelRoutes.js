const express = require("express");
const artikelController = require("../controllers/artikelcontroller");
const router = express.Router();
const uploadFiles = artikelController.uploadFiles();

router.get("/get", artikelController.getAllArtikel);
router.get("/get/:id", artikelController.getArtikelById);
router.post("/store", uploadFiles, artikelController.createArtikel);
router.put("/update/:id", uploadFiles, artikelController.updateArtikel);
router.delete("/delete/:id", artikelController.deleteArtikelById);

module.exports = router;
