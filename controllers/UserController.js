const User = require("../models/User");
class UserController {
  //GET /allUsers     get all user
  async getAllUsers(req, res, next) {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //
  async deleteUser(req, res, next) {
    try {
      const user = await User.deleteOne({ _id: req.params.id });
      res.status(200).json("delete thanh cong");
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = new UserController();
