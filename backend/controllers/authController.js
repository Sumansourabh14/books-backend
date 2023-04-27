const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const loginController = asyncHandler(async (req, res, next) => {
  console.log(req.cookies);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("All fields are required"));
  }

  const user = await UserModel.findOne({ email });

  if (user && bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } else {
    res.status(400);
    return next(new Error("Incorrect email or password"));
  }
});

const logoutController = asyncHandler(async (req, res, next) => {});

module.exports = { loginController, logoutController };
