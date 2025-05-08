const express = require("express");
const gradeFormulaController = require("../controllers/gradeFormulaController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", gradeFormulaController.getAllFormulas);
router.get("/get/:id", gradeFormulaController.getDetailFormula);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), gradeFormulaController.updateFormula);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), gradeFormulaController.deleteFormula);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), gradeFormulaController.createFormula);

router.post("/:id/component/store", authMiddleware, authorizeRoles(['STAFF']), gradeFormulaController.addComponent);
router.put("/component/update/:id", authMiddleware, authorizeRoles(['STAFF']), gradeFormulaController.updateComponent);

module.exports = router;
