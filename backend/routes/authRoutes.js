const express = require("express");
const {
  loginController,
  logoutController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", loginController);

router.get("/logout", logoutController);

module.exports = router;
