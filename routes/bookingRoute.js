const bookingRoute = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const validatorFunc = require("../utils/validatorFunction.helper");
const { protect } = require("../middlewares/authUserMiddleware");
const { validateUserRegistration } = require("../validators/user.validator");
const { checkProfileSize, upload } = require("../helpers/multer");

bookingRoute.use(protect);

bookingRoute.put("/update", userController.addUserDetail);

module.exports = bookingRoute;
