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
const { User, Booking } = require("../models");

class BookingService {
  // User Sign up
  addBooking = async (payload) => {
    try {
      const {
        customerName,
        customerEmail,
        bookingDate,
        bookingType,
        bookingSlot,
        bookingTime,
        phone,
        address,
        userId,
      } = payload;

      const date = new Date(bookingDate);

      // Check for conflicts based on booking type
      let conflict = null;

      if (bookingType === "Full Day") {
        conflict = await Booking.findOne({
          where: {
            bookingDate: date,
            bookingType: "Full Day",
          },
        });
      } else if (bookingType === "Half Day") {
        conflict = await Booking.findOne({
          where: {
            bookingDate: date,
            bookingType: "Full Day",
          },
        });

        if (!conflict) {
          conflict = await Booking.findOne({
            where: {
              bookingDate: date,
              bookingType: "Half Day",
              bookingSlot: bookingSlot,
            },
          });
        }
      } else if (bookingType === "Custom") {
        conflict = await Booking.findOne({
          where: {
            bookingDate: date,
            bookingType: "Full Day",
          },
        });

        if (!conflict) {
          conflict = await Booking.findOne({
            where: {
              bookingDate: date,
              bookingType: "Half Day",
              bookingSlot: bookingSlot,
            },
          });
        }

        if (!conflict && bookingTime && bookingTime.startsWith("0")) {
          conflict = await Booking.findOne({
            where: {
              bookingDate: date,
              bookingType: "Half Day",
              bookingSlot: "First Half", // Prevent First Half from being booked if morning time is chosen
            },
          });
        }
      }

      if (conflict) {
        return throwError(returnMessage("booking", "alreadyBooked"));
      }

      // Create the booking
      const newBooking = await Booking.create({
        customerName,
        customerEmail,
        bookingDate: date,
        bookingType,
        bookingSlot,
        bookingTime,
        phone,
        address,
        userId,
      });

      return newBooking;
    } catch (error) {
      logger.error(`Error while Create booking signup: ${error}`);
      return throwError(error?.message, error?.statusCode);
    }
  };
}

module.exports = BookingService;
