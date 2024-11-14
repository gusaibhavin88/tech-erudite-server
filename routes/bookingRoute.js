const bookingRoute = require("express").Router();
const bookingController = require("../controllers/bookingController");
const validatorFunc = require("../utils/validatorFunction.helper");
const { protect } = require("../middlewares/authUserMiddleware");
const { validateUserRegistration } = require("../validators/user.validator");
const { checkProfileSize, upload } = require("../helpers/multer");

bookingRoute.use(protect);

bookingRoute.post("/add", bookingController.addBooking);

module.exports = bookingRoute;
