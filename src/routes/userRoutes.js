const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware, authorizeRoles } = require("../middlewares/authMiddleware");
const router = express.Router();
const uploadFiles = userController.uploadFiles();
const compressMedia = userController.compressAndUpload;

router.get("/get", authMiddleware, authorizeRoles(['STAFF']), userController.getUsers);
router.get("/get/:token", authMiddleware, userController.getUser);
router.put("/update/:token", authMiddleware, userController.updateUser);
router.put("/update/photo/:id", authMiddleware, uploadFiles, compressMedia, userController.updatePhotoUser);

module.exports = router;
