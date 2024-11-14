const jwt = require("jsonwebtoken");
const logger = require("../logger");
const { throwError } = require("../helpers/errorUtil");
const {
  returnMessage,
  validateEmail,
  passwordValidation,
  verifyUser,
} = require("../utils/utils");
const statusCode = require("../messages/statusCodes.json");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../helpers/sendEmail");
const { User } = require("../models");

class UserService {
  tokenGenerator = async (payload) => {
    try {
      const expiresIn = payload?.remember_me
        ? process.env.JWT_REMEMBER_EXPIRE
        : process.env.JWT_EXPIRES_IN;
      const token = jwt.sign(
        { id: payload.id },
        process.env.JWT_User_SECRET_KEY,
        {
          expiresIn,
        }
      );

      return { token, user: payload };
    } catch (error) {
      logger.error(`Error while token generate, ${error}`);
      throwError(error?.message, error?.statusCode);
    }
  };

  // User Sign up
  signUp = async (payload) => {
    try {
      const { email, password, firstName, lastName } = payload;

      if (!validateEmail(email)) {
        return throwError(returnMessage("auth", "invalidEmail"));
      }

      if (!passwordValidation(password)) {
        return throwError(returnMessage("auth", "invalidPassword"));
      }

      const user = await User.findOne({ where: { email } });
      console.log(user);
      if (user) {
        return throwError(returnMessage("auth", "emailExist"));
      }
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const hashPassword = await bcrypt.hash(password, 14);

      let newUser = await User.create({
        email,
        password: hashPassword,
        firstName,
        lastName,
        verificationToken,
      });

      const encode = encodeURIComponent(payload?.email);
      const link = `${process.env.REACT_APP_URL}/verify/?token=${verificationToken}&email=${encode}`;
      const userVerifyTemplate = verifyUser(
        link,
        payload?.firstName + " " + payload?.lastName
      );
      sendEmail({
        email,
        subject: returnMessage("emailTemplate", "verifyUser"),
        message: userVerifyTemplate,
      });
      return newUser;
    } catch (error) {
      logger.error(`Error while user signup: ${error}`);
      return throwError(error?.message, error?.statusCode);
    }
  };

  // Verify User
  verifyUser = async (payload) => {
    try {
      const { email, verificationToken } = payload;
      const decodedMail = email;
      const user = await User.findOne({
        where: { email: decodedMail, verificationToken },
      });
      if (!user) {
        return throwError(returnMessage("admin", "userNotFound"));
      }
      user.verificationToken = null;
      user.isVerified = true;
      user.save();
      return;
    } catch (error) {
      logger.error(`Error while verification: ${error}`);
      return throwError(error?.message, error?.statusCode);
    }
  };

  // User Login
  login = async (payload) => {
    try {
      const { email, password } = payload;

      if (!validateEmail(email)) {
        return throwError(returnMessage("auth", "invalidEmail"));
      }

      if (!passwordValidation(password)) {
        return throwError(returnMessage("auth", "invalidPassword"));
      }
      console.log("jhjyh");

      const user = await User.findOne({ email: email });
      if (!user) {
        return throwError(returnMessage("auth", "invalidUser"));
      }

      const correctPassword = await bcrypt.compare(password, user?.password);

      if (!correctPassword) {
        return throwError(returnMessage("auth", "invalidUser"));
      }

      const userData = await this.tokenGenerator(user);
      return userData;
    } catch (error) {
      logger.error(`Error while  login : ${error}`);
      return throwError(error?.message, error?.statusCode);
    }
  };
}

module.exports = UserService;
