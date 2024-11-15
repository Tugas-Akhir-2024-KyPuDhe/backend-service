const express = require("express");
const studentController = require("../controllers/studentController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = studentController.uploadFiles();
const compressMedia = studentController.compressAndUpload;

router.get("/get/:nis", authMiddleware, authorizeRoles(['STAFF']), studentController.getStudentByNis);
router.put("/updateParent/:nis", authMiddleware, studentController.updateParentStudent);

module.exports = router;
