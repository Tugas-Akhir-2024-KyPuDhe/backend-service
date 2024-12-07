const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = authController.uploadFiles();
const compressMedia = authController.compressAndUpload;

router.post("/register/student", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, authController.registerStudent);
router.post("/register/staff", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, authController.registerStaff);
router.post("/login", authController.login);
router.get("/verify-token", authController.verifyToken);

module.exports = router;
