const { hotels, bills, orders } = require("../models");

class HotelsRepo {
  static async createHotel({ hotelName, statusDebt, totalBills, totalPaid }) {
    const createHotel = await hotels.create({
      hotelName,
      statusDebt,
      totalBills,
      totalPaid,
    });

    return createHotel;
  }

  static async editHotel({ id, hotelName }) {
    const editHotel = await hotels.update({ hotelName }, { where: { id: id } });
    return editHotel;
  }

  static async editHotelPaid({ id, totalBills, totalPaid }) {
    const editHotel = await hotels.update(
      { totalBills, totalPaid },
      { where: { id: id } }
    );
    return editHotel;
  }

  static async deleteHotel({ id }) {
    const deleteHotel = await hotels.destroy({ where: { id: id } });
    return deleteHotel;
  }

  static async getHotelById({ id }) {
    const getHotel = await hotels.findOne({ where: { id: id } });

    return getHotel;
  }

  static async getHotelByName({ hotelName }) {
    const getHotel = await hotels.findOne({ where: { hotelName: hotelName } });

    return getHotel;
  }

  static async getAllHotels() {
    const getHotel = await hotels.findAll();
    return getHotel;
  }

  static async getDetailHotels({ id }) {
    const getHotel = await hotels.findOne({
      where: { id: id },
      include: [
        {
          model: bills,
          attributes: ["id", "ordersTotal", "createdAt"],
          include: [
            {
              model: orders,
              attributes: [
                "id",
                "productName",
                "quantity",
                "productPrice",
                "total",
                "createdAt",
              ],
            },
          ],
        },
      ],
    });
    return getHotel;
  }

  static async updateHotelTotalBill({ id, totalBills }) {
    const updateHotelBill = await hotels.update(
      { totalBills: totalBills },
      { where: { id: id } }
    );
    return updateHotelBill;
  }
}

module.exports = HotelsRepo;
