const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.put("/resetPassword/:token", authController.resetPassword);

module.exports = router;
