// Middleware for validating token

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

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

  if (!token) {
    res.status(401);
    return next(new Error("Invalid token"));
  }

  next();
});

module.exports = authMiddlware;
