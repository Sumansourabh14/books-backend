const express = require("express");
const {
  loginController,
  logoutController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);

router.put("/logout", authMiddleware, logoutController);

module.exports = router;
