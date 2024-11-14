const logger = require("../logger");
const { throwError } = require("../helpers/errorUtil");
const {
  returnMessage,
  validateEmail,
  passwordValidation,
} = require("../utils/utils");
const statusCode = require("../messages/statusCodes.json");
const bcrypt = require("bcryptjs");
const { User_Details, User } = require("../models");

class UserService {
  // Add User Details
  addUserDetail = async (payload, user) => {
    try {
      const { address, phone } = payload;

      const exitingUser = await User_Details.findOne({
        where: {
          user_id: user.id,
        },
      });

      if (exitingUser) {
        await exitingUser.update({
          address,
          phone,
        });
      } else {
        await User_Details.create({
          address,
          phone,
          user_id: user.id,
        });
      }

      return;
    } catch (error) {
      logger.error(`Error while user update: ${error}`);
      return throwError(error?.message, error?.statusCode);
    }
  };
}

module.exports = UserService;
