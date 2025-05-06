const express = require("express");
const studentAttendanceController = require("../controllers/studentAttendanceController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get/", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER', 'STAFF']), studentAttendanceController.getAttendance);
router.get("/weekly/", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER', 'STAFF']), studentAttendanceController.getWeeklyAttendance);
router.get("/get/student/", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER', 'STAFF']), studentAttendanceController.getAttendanceByStudent);
router.get("/get/summary/:classId", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER', 'STAFF']), studentAttendanceController.getAttendanceSummary);
router.post("/store/", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER']), studentAttendanceController.createAttendance);
router.put("/update/:attendanceId", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER']), studentAttendanceController.updateAttendance);
router.put("/update/final/:attendanceId", authMiddleware, authorizeRoles(['STUDENT', 'TEACHER']), studentAttendanceController.updateStatusAttendance);

module.exports = router;
