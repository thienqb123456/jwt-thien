const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");
const middlewareController = require("../controllers/MiddlewareController");

//post register action
router.post("/register-user", authController.registerUser);

// post login action
router.post("/login-user", authController.loginUser);

//refresh
router.post("/refreshtoken", authController.requestRefreshToken);

// Log out
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.logoutUser
);

module.exports = router;
