const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
let refreshTokens = []; // REDIS anyway

class AuthController {
  //  [POST]  auth/register   (register User)
  async registerUser(req, res) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashed = await bcrypt.hash(req.body.password, salt);

      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Handle when username & email exists
      const userNameCheck = await User.findOne({
        username: req.body.username,
      });
      const emailCheck = await User.findOne({ email: req.body.email });
      if (userNameCheck) {
        res.status(401).json("da ton tai username");
      } else if (emailCheck) {
        res.status(401).json("da ton tai email");
      } else {
        //save to DB
        const user = newUser.save();
        res.status(200).json(" da tao thanh cong tai khoan");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //Generate Access Token
  generateAccessToken(user) {
    return jwt.sign({ user }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "30s",
    });
  }
  //Generate Refresh Token
  generateRefreshToken(user) {
    return jwt.sign({ user }, process.env.JWT_REFRESH_KEY, {
      expiresIn: "365d",
    });
  }

  // [POST] auth/login
  async loginUser(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Khong co ten dang nhap trong he thong");
      } else {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );

        if (!validPassword) {
          res.status(404).json("sai mật khẩu");
        }

        if (user && validPassword) {
          //generate Token
          const authController = new AuthController();
          const accessToken = authController.generateAccessToken(user);
          const refreshToken = authController.generateRefreshToken(user);

          //push refreshToken to refreshTokens array
          refreshTokens.push(refreshToken);

          //save refreshToken to cookie
          res.cookie("refreshTokenInCookie", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          res.status(200).json({ user, accessToken });
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async requestRefreshToken(req, res) {
    try {
      //take refresh token from cookie
      const refreshToken = req.cookies.refreshTokenInCookie;
      if (!refreshToken) {
        res.status(401).json("you are not authenticated");
      } else if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json("token is not valid");
      } else {
        jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_KEY,
          function (err, userDecoded) {
            if (err) {
              console.log(err);
            } else {
              console.log(userDecoded);
              //create new access token and refresh token
              const authController = new AuthController();
              const newAccessToken = authController.generateAccessToken(
                userDecoded.user
              );
              const newRefreshToken = authController.generateRefreshToken(
                userDecoded.user
              );
              //filter tokens are not refreshToken to refreshToken array (meaning : not include the old refreshToken)
              refreshTokens = refreshTokens.filter(
                (token) => token !== refreshToken
              );
              //then push newRefreshToken to refreshTokens array
              refreshTokens.push(newRefreshToken);
              //save newRefreshToken to cookie
              res.cookie("refreshTokenInCookie", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
              });
              res.status(200).json({
                accessToken: newAccessToken,
              });
            }
          }
        );
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async logoutUser(req, res) {
    res.clearCookie("refreshTokenInCookie");
    refreshTokens = refreshTokens.filter((token) => {
      token !== req.cookies.refreshTokenInCookie;
    });
    res.status(200).json("logged out !!!");
  }
}

module.exports = new AuthController();
