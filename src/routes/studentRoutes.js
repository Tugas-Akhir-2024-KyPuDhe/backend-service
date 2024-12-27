const express = require("express");
const studentController = require("../controllers/studentController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get/", authMiddleware, studentController.getAllStudents);
router.get("/get/:nis", authMiddleware, studentController.getStudentByNis);
router.get("/newStudent/", authMiddleware, authorizeRoles(['STAFF']), studentController.getNewStudent);
router.put("/updateParent/:nis", authMiddleware, authorizeRoles(['STUDENT', 'STAFF', 'TEACHER']), studentController.updateParentStudent);

module.exports = router;
