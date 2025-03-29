const express = require("express");
const studentController = require("../controllers/studentController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = studentController.uploadFiles();
const compressMedia = studentController.compressAndUpload;

router.get("/get/", authMiddleware, studentController.getAllStudents);
router.get("/get/:nis", authMiddleware, studentController.getStudentByNis);
router.get("/parent/get/", authMiddleware, studentController.getParentOfStudent);
router.get("/newStudent/", authMiddleware, authorizeRoles(['STAFF']), studentController.getNewStudent);
router.put("/updateParent/:nis", authMiddleware, authorizeRoles(['STUDENT', 'STAFF', 'TEACHER']), studentController.updateParentStudent);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, studentController.updateStudent);
module.exports = router;
