const catchAsyncError = require("../helpers/catchAsyncError");
const { returnMessage } = require("../utils/utils");
const statusCode = require("../messages/statusCodes.json");
const BookingService = require("../services/bookingService");
const { sendResponse } = require("../utils/sendResponse");
const bookingService = new BookingService();

// User Sign Up
exports.signup = catchAsyncError(async (req, res, next) => {
  const user = await bookingService.signUp(req?.body);
  sendResponse(
    res,
    true,
    returnMessage("auth", "registered"),
    user,
    statusCode.success
  );
});
