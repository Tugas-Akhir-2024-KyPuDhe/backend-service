const express = require("express");
const studentAttendanceController = require("../controllers/studentAttendanceController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get/", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER']), studentAttendanceController.getAttendance);
router.post("/store/", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER']), studentAttendanceController.createAttendance);

module.exports = router;
