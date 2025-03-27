const express = require("express");
const staffController = require("../controllers/staffController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = staffController.uploadFiles();
const compressMedia = staffController.compressAndUpload;

router.get("/get/", authMiddleware, authorizeRoles(['STAFF', 'TEACHER']), staffController.getStaff);
router.get("/get/class/", authMiddleware, authorizeRoles(['TEACHER', 'STAFF']), staffController.getClassTeacher);
router.get("/get/class-room/", authMiddleware, authorizeRoles(['TEACHER', 'STAFF']), staffController.getClassRoomTeacher);
router.get("/get/:nip", authMiddleware, authorizeRoles(['TEACHER', 'STAFF']), staffController.getStaffByUsername);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, staffController.updateUserStaff);

module.exports = router;
