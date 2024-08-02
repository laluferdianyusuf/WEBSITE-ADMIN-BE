const OrderService = require("../services/ordersService");

const createOrders = async (req, res) => {
  const { billId, productName, quantity, productPrice } = req.body;
  const { status, status_code, message, data } =
    await OrderService.createOrderByBillId({
      billId,
      productName,
      quantity,
      productPrice,
    });
  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};
const updateBillById = async (req, res) => {
  const { id } = req.params;
  const { productName, quantity, productPrice } = req.body;

  const { status, status_code, message, data } =
    await OrderService.updateOrderById({
      id,
      productName,
      quantity,
      productPrice,
    });
  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = { updateBillById, createOrders };
