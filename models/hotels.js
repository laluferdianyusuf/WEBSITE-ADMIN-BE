"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hotels extends Model {
    static associate(models) {
      hotels.hasMany(models.bills, {
        foreignKey: "hotelId",
        onDelete: "CASCADE",
      });
    }
  }
  hotels.init(
    {
      hotelName: DataTypes.STRING,
      statusDebt: DataTypes.STRING,
      totalBills: DataTypes.BIGINT,
      totalPaid: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "hotels",
    }
  );
  return hotels;
};
