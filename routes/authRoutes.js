const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register/student", authController.registerStudent);
router.post("/register/staff", authController.registerStaff);
router.post("/login", authController.login);
router.post("/test", authMiddleware, authController.login);
router.post("/verify-token", authController.verifyToken);

module.exports = router;
