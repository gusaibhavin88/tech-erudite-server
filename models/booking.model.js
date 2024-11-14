"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      bookingType: {
        type: DataTypes.ENUM("Full Day", "Half Day", "Custom"),
        allowNull: false,
      },
      bookingSlot: {
        type: DataTypes.ENUM("First Half", "Second Half"),
        allowNull: true,
        validate: {
          isRequiredIfHalfDay(value) {
            if (this.bookingType === "Half Day" && !value) {
              throw new Error(
                "Booking slot is required when booking type is Half Day"
              );
            }
          },
        },
      },
      bookingTime: {
        type: DataTypes.TIME,
        allowNull: true,
        validate: {
          isRequiredIfCustom(value) {
            if (this.bookingType === "Custom" && !value) {
              throw new Error(
                "Booking time is required when booking type is Custom"
              );
            }
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Booking",
      timestamps: true,
    }
  );
  return Booking;
};
