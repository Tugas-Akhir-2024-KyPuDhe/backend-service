const express = require("express");
const configSchoolController = require("../controllers/configSchoolController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/get", configSchoolController.getConfigSchool);
router.put("/update", authMiddleware, authorizeRoles(['STAFF']), configSchoolController.updateConfigSchool);
router.get("/statistik", configSchoolController.getStatistik);

module.exports = router;
