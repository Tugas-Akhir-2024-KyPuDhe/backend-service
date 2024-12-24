const express = require("express");
const studentHistoryController = require("../controllers/studentHistoryController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", authMiddleware, studentHistoryController.getAllStudentHistory);
router.get("/get/:uuid", authMiddleware, studentHistoryController.getDetailStudentHistory);

module.exports = router;
