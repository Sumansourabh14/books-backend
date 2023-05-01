// Middleware for validating token
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const authMiddlware = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && req.headers.authorization.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        return next(new Error("User is not authorized"));
      }

      req.user = decoded.user;
    });
  }

  // const {token} = req.cookies

  if (!token) {
    res.status(401);
    return next(new Error("Invalid token"));
  }

  // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // req.user = await UserModel.findById(decoded.user.id)

  next();
});

module.exports = authMiddlware;
