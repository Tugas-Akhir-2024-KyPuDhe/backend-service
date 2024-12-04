const express = require("express");
const courseController = require("../controllers/courseController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = courseController.uploadFiles();
const compressMedia = courseController.compressAndUpload;

router.get("/get", courseController.getAllCourse);
router.get("/get/:id", courseController.getCourseById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, courseController.updateCourse);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), courseController.deleteCourseById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, courseController.createCourse);

module.exports = router;
