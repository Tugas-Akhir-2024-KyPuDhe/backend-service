const express = require("express");
const studentPositionInClassController = require("../controllers/studentPositionInClassController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/store", authMiddleware, authorizeRoles(['STAFF', 'TEACHER']), studentPositionInClassController.addStudentPosition);
router.get("/get-byClassId/:id", authMiddleware, authorizeRoles(['STAFF', 'TEACHER', 'STUDENT']), studentPositionInClassController.getPosisitionByClassId);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF', 'TEACHER']), studentPositionInClassController.deleteStudentPosition);

module.exports = router;
