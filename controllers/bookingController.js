const catchAsyncError = require("../helpers/catchAsyncError");
const { returnMessage } = require("../utils/utils");
const statusCode = require("../messages/statusCodes.json");
const BookingService = require("../services/bookingService");
const { sendResponse } = require("../utils/sendResponse");
const bookingService = new BookingService();

// Add Booking
exports.addBooking = catchAsyncError(async (req, res, next) => {
  const user = await bookingService.addBooking(req?.body, req?.user);
  sendResponse(
    res,
    true,
    returnMessage("booking", "created"),
    user,
    statusCode.success
  );
});
