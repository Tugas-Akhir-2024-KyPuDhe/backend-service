const express = require("express");
const configSchoolController = require("../controllers/configSchoolController");
const router = express.Router();

router.get("/get", configSchoolController.getConfigSchool);
router.put("/update", configSchoolController.updateConfigSchool);

module.exports = router;
