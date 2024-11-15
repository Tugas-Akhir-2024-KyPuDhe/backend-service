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

module.exports = router;
