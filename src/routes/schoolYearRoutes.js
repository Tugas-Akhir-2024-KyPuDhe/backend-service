const express = require("express");
const schoolYearController = require("../controllers/schoolYearController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", schoolYearController.getAllSchoolYear);
router.get("/get/:id", schoolYearController.getSchoolYearById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), schoolYearController.updateSchoolYear);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), schoolYearController.deleteSchoolYearById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), schoolYearController.createSchoolYear);

module.exports = router;
