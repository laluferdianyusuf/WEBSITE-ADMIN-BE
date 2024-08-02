const BillsRepo = require("../repositories/billsRepo");
const HotelsRepo = require("../repositories/hotelsRepo");
const OrderRepo = require("../repositories/ordersRepo");

class BillService {
  static async createBill({ hotelId, billData }) {
    try {
      if (!hotelId) {
        return {
          status: false,
          status_code: 400,
          message: "Hotel ID is required",
          data: { bill: null },
        };
      }
      if (!billData || !Array.isArray(billData) || billData.length === 0) {
        return {
          status: false,
          status_code: 400,
          message: "Bills array is required",
          data: { bill: null },
        };
      }

      const getHotel = await HotelsRepo.getHotelById({ id: hotelId });
      if (!getHotel) {
        return {
          status: false,
          status_code: 404,
          message: "Hotel not found",
          data: { bill: null },
        };
      }

      const createBill = await BillsRepo.createBill({
        hotelId: getHotel.id,
        ordersTotal: 0,
        paidTotal: 0,
      });

      if (!createBill) {
        return {
          status: false,
          status_code: 500,
          message: "Failed to create bill",
          data: { bill: null },
        };
      }

      const createdOrders = [];
      for (const { productName, quantity, productPrice, total } of billData) {
        if (!productName || !quantity || !productPrice || !total) {
          return {
            status: false,
            status_code: 400,
            message: "Product fields are required",
            data: { bill: null },
          };
        }

        const createOrder = await OrderRepo.createOrder({
          productName,
          quantity,
          productPrice,
          total,
          billId: createBill.id,
        });

        if (!createOrder) {
          return {
            status: false,
            status_code: 500,
            message: "Failed to create order",
            data: { bill: null },
          };
        }

        createdOrders.push(createOrder);
      }

      const allOrders = await OrderRepo.getOrdersByBillId({
        billId: createBill.id,
      });
      const newTotal = allOrders.reduce(
        (sum, order) => parseInt(sum) + parseInt(order.total),
        0
      );

      await BillsRepo.updateTotalBill({
        id: createBill.id,
        ordersTotal: newTotal,
      });

      const updatedHotel = await HotelsRepo.updateHotelTotalBill({
        id: getHotel.id,
        totalBills: getHotel.totalBills + newTotal,
      });

      if (!updatedHotel) {
        return {
          status: false,
          status_code: 500,
          message: "Failed to update hotel total bill",
          data: { bill: null },
        };
      }

      return {
        status: true,
        status_code: 200,
        message:
          "Bill and orders successfully created, hotel total bill updated",
        data: {
          bill: createdOrders,
        },
      };
    } catch (error) {
      console.error("Error creating bill:", error);
      return {
        status: false,
        status_code: 500,
        message: `Error: ${error.message}`,
        data: { bill: null },
      };
    }
  }

  static async getBillByHotelId({ hotelId }) {
    try {
      const billsWithHotel = await BillsRepo.getBillByHotelId({ hotelId });

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const groupedByHotel = billsWithHotel.reduce((acc, bill) => {
        const hotelName = bill.hotel ? bill.hotel.hotelName : "Unknown Hotel";
        const hotelDate = formatDate(bill.createdAt);

        if (!acc[hotelName]) {
          acc[hotelName] = {};
        }

        if (!acc[hotelName][hotelDate]) {
          acc[hotelName][hotelDate] = [];
        }

        acc[hotelName][hotelDate].push({
          billId: bill.id,
          orders: bill.orders.map((order) => ({
            productName: order.productName,
            quantity: order.quantity,
            productPrice: order.productPrice,
          })),
        });

        return acc;
      }, {});

      const result = Object.keys(groupedByHotel).map((hotelName) => ({
        hotelName,
        dates: Object.keys(groupedByHotel[hotelName]).map((date) => ({
          date,
          bills: groupedByHotel[hotelName][date],
        })),
      }));

      if (result.length > 0) {
        return {
          status: true,
          status_code: 200,
          message: "Success get bill",
          data: {
            bills: result,
          },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "Bill not found",
          data: {
            bills: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error.message,
        data: {
          bills: null,
        },
      };
    }
  }

  static async getAllBills() {
    try {
      const billsWithHotel = await BillsRepo.getAllBills();

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const result = billsWithHotel.map((bill) => ({
        billId: bill.id,
        date: formatDate(bill.createdAt),
        updatedAt: bill.updatedAt,
        hotelName: bill.hotel ? bill.hotel.hotelName : "Unknown Hotel",
        total: bill.ordersTotal,
        orders: bill.orders.map((order, index) => ({
          productName: order.productName,
          quantity: order.quantity,
          productPrice: order.productPrice,
        })),
      }));

      if (result.length > 0) {
        return {
          status: true,
          status_code: 200,
          message: "Success get bills",
          data: {
            bills: result,
          },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "No bills found",
          data: {
            bills: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error.message,
        data: {
          bills: null,
        },
      };
    }
  }

  static async getBillOrderById({ id }) {
    try {
      const getBill = await BillsRepo.getBillOrderById({ id });

      if (getBill && getBill.length > 0) {
        return {
          status: true,
          status_code: 200,
          message: "data found",
          data: { bill: getBill },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "no data found",
          data: { bill: null },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error: " + error,
        data: { bill: null },
      };
    }
  }

  static async deleteBill({ id }) {
    try {
      await OrderRepo.deleteOrderById({ billId: id });

      const bill = await BillsRepo.getBillById({ id });

      if (!bill) {
        return {
          status: false,
          status_code: 404,
          message: "Bill not found",
          data: { bill: null },
        };
      }

      const deleteBill = await BillsRepo.deleteBillById({ id });

      const hotel = await HotelsRepo.getHotelById({ id: bill.hotelId });

      if (!hotel) {
        return {
          status: false,
          status_code: 404,
          message: "Hotel not found",
          data: { bill: null },
        };
      }

      const newTotalBill = hotel.totalBill - bill.ordersTotal;

      const updateTotalBill = await HotelsRepo.updateHotelTotalBill({
        id: bill.hotelId,
        totalBills: newTotalBill,
      });

      if (updateTotalBill) {
        return {
          status: true,
          status_code: 200,
          message: "Delete success",
          data: { bill: deleteBill },
        };
      } else {
        return {
          status: false,
          status_code: 407,
          message: "Failed to update hotel total bill",
          data: { bill: null },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error,
        data: { bill: null },
      };
    }
  }

  static async getDetailBill({ id }) {
    try {
      const getDetailBill = await BillsRepo.getDetailBill({ id });

      if (getDetailBill) {
        return {
          status: true,
          status_code: 200,
          message: "Detail bill has been successfully retrieved",
          data: {
            bill: getDetailBill,
          },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "Detail bill not found",
          data: {
            bill: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error" + error.message,
        data: {
          bill: null,
        },
      };
    }
  }
}

module.exports = BillService;
