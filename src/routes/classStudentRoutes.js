const express = require("express");
const classStudentController = require("../controllers/classStudentController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

// router.post("/createClassInvStudent", authMiddleware, authorizeRoles(['STAFF']), classStudentController.createClassInvStudent);
router.get("/get", authMiddleware, authorizeRoles(['STAFF']), classStudentController.getAllClass);
router.get("/get/:id", authMiddleware, authorizeRoles(['STAFF']), classStudentController.getClassById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), classStudentController.updateClass);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), classStudentController.createClass);

module.exports = router;