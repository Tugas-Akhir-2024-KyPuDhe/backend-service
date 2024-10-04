const express = require("express");
const jurusanController = require("../controllers/jurusancontroller");
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get("/get", jurusanController.getAllJurusan);
router.get("/get/:id", jurusanController.getJurusanById);
router.put("/update/:id", upload.array('media'), jurusanController.updateJurusan);
router.delete("/delete/:id", jurusanController.deleteJurusanById);
router.post("/store", upload.array('media'), jurusanController.createJurusan);

module.exports = router;
