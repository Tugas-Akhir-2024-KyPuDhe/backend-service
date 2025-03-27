const express = require("express");
const academicYearController = require("../controllers/academicYearController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", academicYearController.getAllAcademicYear);
router.get("/get/:id", academicYearController.getAcademicYearById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), academicYearController.updateAcademicYear);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), academicYearController.deleteAcademicYearById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), academicYearController.createAcademicYear);

module.exports = router;
