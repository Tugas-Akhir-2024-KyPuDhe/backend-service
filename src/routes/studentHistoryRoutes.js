const express = require("express");
const studentHistoryController = require("../controllers/studentHistoryController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", authMiddleware, studentHistoryController.getAllStudentHistory);

module.exports = router;
