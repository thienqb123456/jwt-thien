const { response } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

class MiddlewareController {
  verifyToken(req, res, next) {
    const tokenUser = req.headers.token;
    if (tokenUser) {
      const accessToken = tokenUser.split(" ")[1];
      jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_KEY,
        function (err, userDecoded) {
          if (err) {
            res.status(403).json("token is not valid");
          } else {
            console.log(userDecoded);
            req.user = userDecoded.user;
            next();
          }
        }
      );
    } else {
      res.status(401).json("you are not authenticated");
    }
  }

  verifyTokenAndDeleteUser(req, res, next) {
    const middlewareController = new MiddlewareController();
    middlewareController.verifyToken(req, res, function () {
      if (req.user._id == req.params.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("you are not allow to delete other");
      }
    });
  }
}

module.exports = new MiddlewareController();
