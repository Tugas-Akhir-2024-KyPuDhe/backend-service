const express = require("express");
const classStudentController = require("../controllers/classStudentController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/createClassInvStudent", authMiddleware, authorizeRoles(['STAFF']), classStudentController.createClassInvStudent);

module.exports = router;