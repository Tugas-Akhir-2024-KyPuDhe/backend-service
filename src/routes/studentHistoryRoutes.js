const express = require("express");
const studentHistoryController = require("../controllers/studentHistoryController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", authMiddleware, authorizeRoles(['TEACHER', 'STAFF', 'STUDENT']), studentHistoryController.getAllStudentHistory);
router.get("/get/:uuid", authMiddleware, authorizeRoles(['TEACHER', 'STAFF', 'STUDENT']), studentHistoryController.getDetailStudentHistory);

module.exports = router;
