const express = require("express");
const bannerController = require("../controllers/bannerController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = bannerController.uploadFiles();

router.get("/get", bannerController.getAllBanner);
router.get("/get/:id", bannerController.getBannerById);
router.put("/update/:id", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, bannerController.updateBanner);
router.delete("/delete/:id", authMiddleware, authorizeRoles(['STAFF']), bannerController.deleteBannerById);
router.post("/store", authMiddleware, authorizeRoles(['STAFF']), uploadFiles, bannerController.createBanner);

module.exports = router;
