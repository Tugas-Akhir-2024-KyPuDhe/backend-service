const express = require("express");
const problemReportController = require("../controllers/problemReportController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = problemReportController.uploadFiles();
const compressMedia = problemReportController.compressAndUpload;

router.get("/get", problemReportController.getAllProblemReport);
router.get("/get/:id", problemReportController.getProblemReportById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, problemReportController.updateProblemReport);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), problemReportController.deleteProblemReportById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, compressMedia, problemReportController.createProblemReport);

module.exports = router;
