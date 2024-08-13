const { bills, hotels, orders } = require("../models");
const { Op } = require("sequelize");

class BillsRepo {
  static async createBill({ hotelId, ordersTotal, totalPaid, date, number }) {
    const newBill = await bills.create({
      hotelId,
      ordersTotal,
      totalPaid,
      date,
      number,
    });

    return newBill;
  }

  static async getBillByHotelId({ hotelId }) {
    const query = {
      where: {},
      include: [
        {
          model: hotels,
          attributes: ["hotelName"],
        },
        {
          model: orders,
          attributes: ["productName", "quantity", "productPrice"],
        },
      ],
    };
    if (hotelId) {
      query.where = { ...query.where, hotelId: hotelId };
    }

    const getBills = await bills.findAll(query);

    return getBills;
  }

  static async getAllBillByHotelId({ hotelId }) {
    const getHotel = await bills.findAll({ where: { hotelId: hotelId } });
    return getHotel;
  }

  static async getAllBills() {
    const query = {
      include: [
        {
          model: hotels,
          attributes: ["id", "hotelName"],
        },
        {
          model: orders,
          attributes: ["productName", "quantity", "productPrice"],
        },
      ],
    };

    const getBills = await bills.findAll(query);

    return getBills;
  }

  static async getBillOrderById({ id }) {
    const query = {
      where: {},
      include: [
        {
          model: orders,
          attributes: ["productName", "quantity", "productPrice"],
        },
      ],
    };

    if (id) {
      query.where = { ...query.where, id: id };
    }
    const getBill = await bills.findAll(query);
    return getBill;
  }

  static async deleteBillById({ id }) {
    const deleteBill = await bills.destroy({ where: { id: id } });
    return deleteBill;
  }

  static async deleteBillByHotelId({ hotelId }) {
    const deleteBill = await bills.destroy({ where: { hotelId: hotelId } });
    return deleteBill;
  }

  static async getBillById({ id }) {
    const getBill = await bills.findOne({ where: { id: id } });
    return getBill;
  }

  static async updateTotalBill({ id, ordersTotal }) {
    const updateBill = await bills.update(
      { ordersTotal },
      { where: { id: id } }
    );
    return updateBill;
  }

  static async getDetailBill({ id }) {
    const detailBill = await bills.findOne({
      where: { id: id },
      include: [
        {
          model: hotels,
          attributes: ["id", "hotelName"],
        },
        {
          model: orders,
          attributes: [
            "id",
            "productName",
            "quantity",
            "productPrice",
            "total",
          ],
        },
      ],
    });

    return detailBill;
  }

  static async updateBillPaid({ id, totalPaid }) {
    const updatePaidBill = await bills.update({ totalPaid }, { where: { id } });
    return updatePaidBill;
  }

  static async getLastInvoiceByDate({ date }) {
    const getBill = await bills.findOne({
      where: { date: { [Op.startsWith]: date } },
      order: [["createdAt", "DESC"]],
    });
    return getBill;
  }

  static async getLastInvoice() {
    const getLastBill = await bills.findOne({
      order: [["createdAt", "DESC"]],
    });

    return getLastBill;
  }

  static async updateBill({ id, hotelId, date }) {
    const updatedBill = await bills.update(
      { hotelId, date },
      { where: { id: id } }
    );
    return updatedBill;
  }
}

module.exports = BillsRepo;
