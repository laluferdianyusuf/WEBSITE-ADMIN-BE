const OrderRepo = require("../repositories/ordersRepo");
const BillRepo = require("../repositories/billsRepo");

class OrderService {
  static async createOrderByBillId({
    billId,
    productName,
    quantity,
    productPrice,
  }) {
    try {
      const total = quantity * productPrice;

      const createOrder = await OrderRepo.createOrder({
        productName,
        quantity,
        productPrice,
        total,
        billId,
      });

      const bill = await BillRepo.getBillById({ id: billId });
      if (bill) {
        const totals = (bill.ordersTotal += total);
        await BillRepo.updateTotalBill({ id: bill.id, ordersTotal: totals });
      }
      return {
        status: true,
        status_code: 201,
        message: "created successfully",
        data: {
          orders: createOrder,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error creating order" + error.message,
        data: {
          orders: null,
        },
      };
    }
  }
  static async updateOrderById({ id, productName, quantity, productPrice }) {
    try {
      const getOrder = await OrderRepo.getOrderById({ id });

      if (getOrder) {
        if (!productName) {
          productName = getOrder.productName;
        }
        if (!quantity) {
          quantity = getOrder.quantity;
        }
        if (!productPrice) {
          productPrice = getOrder.productPrice;
        }

        const updateBill = await OrderRepo.updateOrderById({
          id: id,
          productName: productName,
          quantity: quantity,
          productPrice: productPrice,
          total: quantity * productPrice,
        });

        return {
          status: true,
          status_code: 200,
          message: "updated successfully",
          data: {
            orders: updateBill,
          },
        };
      } else {
        return {
          status: false,
          status_code: 401,
          message: "updated unsuccessfully",
          data: {
            orders: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: { orders: null },
      };
    }
  }
}

module.exports = OrderService;
