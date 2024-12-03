const express = require("express");
const configSchoolController = require("../controllers/configSchoolController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = configSchoolController.uploadFiles();
const compressMedia = configSchoolController.compressAndUpload;

router.get("/get", configSchoolController.getConfigSchool);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, configSchoolController.updateConfigSchool);
router.get("/statistik", configSchoolController.getStatistik);

module.exports = router;
