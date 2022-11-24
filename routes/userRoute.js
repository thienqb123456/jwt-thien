const express = require("express");
const router = express.Router();
const middlewareController = require("../controllers/MiddlewareController");
const userController = require("../controllers/UserController");

router.get(
  "/allUsers",
  middlewareController.verifyToken,
  userController.getAllUsers
); // get All user
router.delete(
  "/:id",
  middlewareController.verifyTokenAndDeleteUser,
  userController.deleteUser
); // delete User

module.exports = router;
