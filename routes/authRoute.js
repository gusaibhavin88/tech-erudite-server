const authRoute = require("express").Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const validatorFunc = require("../utils/validatorFunction.helper");
const { protect } = require("../middlewares/authUserMiddleware");
const { validateUserRegistration } = require("../validators/user.validator");
const { checkProfileSize, upload } = require("../helpers/multer");

authRoute.post(
  "/signup",
  // checkProfileSize,
  // upload.single("profile_image"),
  // validateUserRegistration,
  // validatorFunc,
  authController.signup
);
authRoute.post("/login", authController.login);
authRoute.post("/verify-user", authController.verifyUser);
authRoute.use(protect);

authRoute.put("/update", userController.addUserDetail);

module.exports = authRoute;
