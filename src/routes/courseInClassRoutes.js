const express = require("express");
const courseInClassController = require("../controllers/courseInClassController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get/", authMiddleware, authorizeRoles(['TEACHER', 'STAFF', 'STUDENT']), courseInClassController.getCourseInClass);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), courseInClassController.updateCourseInClass);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), courseInClassController.deleteCourseInClassById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), courseInClassController.createCourseInClass);

module.exports = router;
