const express = require("express");
const studentGradeController = require("../controllers/studentGradeController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/store", authMiddleware, authorizeRoles(['TEACHER']), studentGradeController.insertGradeStudent);

module.exports = router;
