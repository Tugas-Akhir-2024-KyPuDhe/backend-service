const express = require("express");
const studentGradeController = require("../controllers/studentGradeController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/store", authMiddleware, authorizeRoles(['TEACHER']), studentGradeController.insertGradeStudent);
router.get("/get/:nis", authMiddleware, studentGradeController.getGradeStudent);

module.exports = router;
