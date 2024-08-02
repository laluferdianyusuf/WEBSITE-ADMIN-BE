"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bills extends Model {
    static associate(models) {
      bills.belongsTo(models.hotels, {
        foreignKey: "hotelId",
      });

      bills.hasMany(models.orders, {
        foreignKey: "billId",
      });
    }
  }
  bills.init(
    {
      hotelId: { type: DataTypes.INTEGER, allowNull: false },
      ordersTotal: { type: DataTypes.BIGINT },
      // totalPaid: { type: DataTypes.BIGINT },
    },
    {
      sequelize,
      modelName: "bills",
    }
  );
  return bills;
};
