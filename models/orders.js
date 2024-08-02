"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      orders.belongsTo(models.bills, {
        foreignKey: "billId",
      });
    }
  }
  orders.init(
    {
      productName: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      productPrice: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      billId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "orders",
    }
  );
  return orders;
};
