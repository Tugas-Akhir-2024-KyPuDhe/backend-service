const express = require("express");
const StudyTracerController = require("../controllers/studyTracerController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", StudyTracerController.getAllStudyTracer);
router.get("/get/:id", StudyTracerController.getStudyTracerById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), StudyTracerController.updateStudyTracer);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), StudyTracerController.deleteStudyTracerById);
router.post("/store", StudyTracerController.createStudyTracer);

module.exports = router;
