const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.put("/resetPassword/:token", authController.resetPassword);

router.put(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.get("/", userController.getAllUsers);

module.exports = router;
