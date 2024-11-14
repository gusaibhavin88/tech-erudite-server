const catchAsyncError = require("../helpers/catchAsyncError");
const { returnMessage } = require("../utils/utils");
const statusCode = require("../messages/statusCodes.json");
const UserService = require("../services/userService");
const { sendResponse } = require("../utils/sendResponse");
const userService = new UserService();

// User updated
exports.addUserDetail = catchAsyncError(async (req, res, next) => {
  const user = await userService.addUserDetail(req?.body, req?.user);
  sendResponse(
    res,
    true,
    returnMessage("auth", "userUpdated"),
    user,
    statusCode.success
  );
});
