const BillsRepo = require("../repositories/billsRepo");
const HotelRepo = require("../repositories/hotelsRepo");
const OrdersRepo = require("../repositories/ordersRepo");

class HotelService {
  static async createHotel({ hotelName }) {
    try {
      if (!hotelName) {
        return {
          status: false,
          status_code: 400,
          message: "name is required",
          data: {
            hotel: null,
          },
        };
      }

      const getHotel = await HotelRepo.getHotelByName({ hotelName });
      if (getHotel) {
        return {
          status: false,
          status_code: 400,
          message: "name already exists",
          data: {
            hotel: null,
          },
        };
      } else {
        const createHotel = await HotelRepo.createHotel({
          hotelName: hotelName,
          statusDebt: "Belum Lunas",
          totalBills: 0,
          totalPaid: 0,
        });

        return {
          status: true,
          status_code: 201,
          message: "hotel has been created",
          data: {
            hotel: createHotel,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: {
          bill: null,
        },
      };
    }
  }

  static async editHotel({ id, hotelName }) {
    try {
      const getHotel = await HotelRepo.getHotelById({ id });

      if (!hotelName) {
        return {
          status: false,
          status_code: 400,
          message: "Hotel name is required",
          data: {
            hotel: null,
          },
        };
      }
      if (getHotel.name) {
        return {
          status: false,
          status_code: 400,
          message: "Name already exists",
          data: {
            hotel: null,
          },
        };
      }
      if (getHotel) {
        if (!hotelName) {
          hotelName = getHotel.name;
        }
        const updateHotel = await HotelRepo.editHotel({
          id: id,
          hotelName,
        });
        return {
          status: true,
          status_code: 200,
          message: "Update successful",
          data: {
            hotel: updateHotel,
          },
        };
      } else {
        return {
          status: false,
          status_code: 401,
          message: "updated unsuccessfully",
          data: {
            hotel: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: {
          hotel: null,
        },
      };
    }
  }

  static async editHotelPaid({ id, totalPaid }) {
    try {
      const getHotel = await HotelRepo.getHotelById({ id });
      const getBill = await BillsRepo.getBillByHotelId(getHotel.id);

      if (!totalPaid) {
        return {
          status: false,
          status_code: 401,
          message: "total paid is required",
          data: {
            hotel: null,
          },
        };
      }
      if (getHotel) {
        if (!totalPaid) {
          totalPaid = getHotel.totalPaid;
        }
        const updateHotel = await HotelRepo.editHotelPaid({
          id: id,
          totalPaid,
          totalBills: getHotel.totalBills - totalPaid,
        });
        return {
          status: true,
          status_code: 200,
          message: "update successful",
          data: {
            hotel: updateHotel,
          },
        };
      } else {
        return {
          status: false,
          status_code: 401,
          message: "updated unsuccessfully",
          data: {
            hotel: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "error" + error,
        data: {
          hotel: null,
        },
      };
    }
  }

  static async updateHotelPaid({ id, totalPaid }) {
    try {
      const getHotel = await HotelRepo.getHotelById({ id });
      const getBills = await BillsRepo.getBillByHotelId(getHotel.id);

      if (!totalPaid || totalPaid <= 0) {
        return {
          status: false,
          status_code: 401,
          message: "Total paid amount is required and must be greater than 0",
          data: {
            hotel: null,
          },
        };
      }

      const sortedBills = getBills.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      let totalRemaining = sortedBills.reduce(
        (sum, bill) => sum + (bill.ordersTotal - bill.totalPaid),
        0
      );

      if (totalPaid > totalRemaining) {
        return {
          status: false,
          status_code: 400,
          message: "Total paid amount exceeds the remaining bill",
          data: {
            hotel: null,
            bills: [],
          },
        };
      }

      let remainingPayment = totalPaid;
      const updatedBills = [];

      for (const bill of sortedBills) {
        if (remainingPayment <= 0) break;

        const billRemaining = bill.ordersTotal - bill.totalPaid;
        const paymentForBill = Math.min(remainingPayment, billRemaining);

        const updatedBill = await BillsRepo.updateBillPaid({
          id: bill.id,
          totalPaid: bill.totalPaid + paymentForBill,
        });

        updatedBills.push(updatedBill);
        remainingPayment -= paymentForBill;
      }

      const allBillsPaid = updatedBills.every(
        (bill) => bill.ordersTotal === bill.totalPaid
      );

      const statusDebt = allBillsPaid ? "Lunas" : getHotel.statusDebt;

      const updatedHotel = await HotelRepo.editHotelPaid({
        id: id,
        totalPaid: getHotel.totalPaid + totalPaid - remainingPayment,
        statusDebt: statusDebt,
      });

      return {
        status: true,
        status_code: 200,
        message: "Update successful",
        data: {
          hotel: updatedHotel,
          bills: updatedBills,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error.message,
        data: {
          hotel: null,
          bills: [],
        },
      };
    }
  }

  static async deleteHotel({ id }) {
    try {
      const deleteHotel = await HotelRepo.deleteHotel({ id });
      if (!deleteHotel) {
        return {
          status: false,
          status_code: 404,
          message: "Hotel not found",
          data: {
            hotel: null,
          },
        };
      }

      const getBills = await BillsRepo.getAllBillByHotelId({ hotelId: id });
      if (getBills.length > 0) {
        const billIds = getBills.map((bill) => bill.id);
        await OrdersRepo.deleteOrderById({ billId: billIds });
        await BillsRepo.deleteBillById({ id: billIds });
      }

      return {
        status: true,
        status_code: 200,
        message: "Deleted successfully",
        data: {
          hotel: deleteHotel,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        status_code: 500,
        message: "Error: " + error.message,
        data: {
          hotel: null,
        },
      };
    }
  }

  static async getAllHotel() {
    try {
      const getHotel = await HotelRepo.getAllHotels();
      if (getHotel) {
        return {
          status: true,
          status_code: 200,
          message: "Hotels",
          data: {
            hotel: getHotel,
          },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "Hotel not found",
          data: {
            hotel: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error getting products" + error.message,
        data: {
          hotel: null,
        },
      };
    }
  }

  static async getDetailHotels({ id }) {
    try {
      const getDetailHotel = await HotelRepo.getDetailHotels({ id });
      if (getDetailHotel) {
        return {
          status: true,
          status_code: 200,
          message: "Detail hotel has been successfully retrieved",
          data: {
            hotel: getDetailHotel,
          },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "Detail hotel not found",
          data: {
            hotel: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error" + error.message,
        data: {
          hotel: null,
        },
      };
    }
  }
}

module.exports = HotelService;
