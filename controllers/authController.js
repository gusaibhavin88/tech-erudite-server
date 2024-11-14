const catchAsyncError = require("../helpers/catchAsyncError");
const { returnMessage } = require("../utils/utils");
const statusCode = require("../messages/statusCodes.json");
const AuthService = require("../services/authService");
const { sendResponse } = require("../utils/sendResponse");
const authService = new AuthService();

// User Sign Up
exports.signup = catchAsyncError(async (req, res, next) => {
  const user = await authService.signUp(req?.body);
  sendResponse(
    res,
    true,
    returnMessage("auth", "registered"),
    user,
    statusCode.success
  );
});

// User Login
exports.login = catchAsyncError(async (req, res, next) => {
  const user = await authService.login(req?.body);
  sendResponse(
    res,
    true,
    returnMessage("auth", "loggedIn"),
    user,
    statusCode.success
  );
});

// User Verify
exports.verifyUser = catchAsyncError(async (req, res, next) => {
  const user = await authService.verifyUser(req?.body);
  sendResponse(
    res,
    true,
    returnMessage("auth", "verified"),
    user,
    statusCode.success
  );
});
