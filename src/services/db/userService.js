const UserModel = require("../models/user.model.js");
const logger = require("../../utils/logger.js");

class UserService {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
}

module.exports = UserService;
