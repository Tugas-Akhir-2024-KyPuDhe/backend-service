const express = require("express");
const studentPositionInClassController = require("../controllers/studentPositionInClassController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/add", authMiddleware, authorizeRoles(['STAFF', 'TEACHER']), studentPositionInClassController.addPositionStudent);

module.exports = router;
