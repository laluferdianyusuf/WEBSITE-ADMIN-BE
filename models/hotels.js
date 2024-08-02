"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class hotels extends Model {
    static associate(models) {
      hotels.hasMany(models.bills, {
        foreignKey: "hotelId",
      });
    }
  }
  hotels.init(
    {
      hotelName: DataTypes.STRING,
      statusDebt: DataTypes.STRING,
      totalBills: DataTypes.INTEGER,
      totalPaid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "hotels",
    }
  );
  return hotels;
};
