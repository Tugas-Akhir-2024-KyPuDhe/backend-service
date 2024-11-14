const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = authController.uploadFiles();
const compressMedia = authController.compressAndUpload;

router.post("/register/student", authController.registerStudent);
router.post("/register/staff", authController.registerStaff);
router.post("/login", authController.login);
router.get("/verify-token", authController.verifyToken);
router.get("/get/users", authMiddleware, authorizeRoles(['STAFF']), authController.getUsers);
router.get("/get/user", authMiddleware, authController.getUser);
router.put("/update/user", authMiddleware, authController.updateUser);
router.get("/get/student/:nis", authMiddleware, authorizeRoles(['STAFF']), authController.getStudentByNis);
router.put("/update/user/photo/:id", authMiddleware,  uploadFiles, compressMedia, authController.updatePhotoUser);

module.exports = router;
