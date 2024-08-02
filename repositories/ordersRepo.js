const { orders } = require("../models");

class OrdersRepo {
  static async createOrder({
    productName,
    quantity,
    productPrice,
    total,
    billId,
  }) {
    const createOrder = await orders.create({
      productName: productName,
      quantity: quantity,
      productPrice: productPrice,
      total: total,
      billId: billId,
    });
    return createOrder;
  }

  static async createOrderByBillId({
    productName,
    quantity,
    productPrice,
    total,
    billId,
  }) {
    const createOrder = await orders.create(
      { where: { billId } },
      {
        productName: productName,
        quantity: quantity,
        productPrice: productPrice,
        total: total,
      }
    );
    return createOrder;
  }

  static async getOrdersById({ id }) {
    const getOrder = await orders.findAll({ where: { id: id } });
    return getOrder;
  }

  static async getOrdersByBillId({ billId }) {
    const getOrder = await orders.findAll({ where: { billId: billId } });
    return getOrder;
  }
  static async getOrderById({ id }) {
    const getOrder = await orders.findOne({ where: { id: id } });
    return getOrder;
  }

  static async deleteOrderById({ billId }) {
    const deleteOrder = await orders.destroy({ where: { billId: billId } });
    return deleteOrder;
  }

  static async updateOrderById({
    id,
    productName,
    quantity,
    productPrice,
    total,
  }) {
    const updateOrder = await orders.update(
      {
        productName: productName,
        quantity: quantity,
        productPrice: productPrice,
        total: total,
      },
      { where: { id: id } }
    );
    return updateOrder;
  }

  static async getOrderByBillId({ billId }) {
    const getOrder = await orders.findOne({ where: { billId: billId } });
    return getOrder;
  }
}

module.exports = OrdersRepo;
