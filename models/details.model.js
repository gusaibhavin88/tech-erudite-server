"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  UserDetail.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 15], // Optional: Phone number length validation
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER, // Fixed to match User model's ID type (INTEGER)
        allowNull: false,
        references: {
          model: "Users", // Ensure 'Users' table name matches actual table name
          key: "id",
        },
        onDelete: "CASCADE", // Ensures UserDetails get deleted if User is deleted
      },
    },
    {
      sequelize,
      modelName: "UserDetail",
      timestamps: true,
    }
  );
  return UserDetail;
};
