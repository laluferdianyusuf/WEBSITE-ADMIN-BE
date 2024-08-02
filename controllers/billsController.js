const BillsService = require("../services/billsService");

const createBill = async (req, res) => {
  const { hotelId, billData } = req.body;

  const { status, status_code, message, data } = await BillsService.createBill({
    hotelId,
    billData,
  });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getBillsByHotelId = async (req, res, next) => {
  const { hotelId } = req.params;
  const { status, status_code, message, data } =
    await BillsService.getBillByHotelId({ hotelId: hotelId });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllBills = async (req, res, next) => {
  const { status, status_code, message, data } =
    await BillsService.getAllBills();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getBillOrderById = async (req, res, next) => {
  const { id } = req.params;
  const { status, status_code, message, data } =
    await BillsService.getBillOrderById({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const deleteBillById = async (req, res, next) => {
  const { id } = req.params;
  const { status, status_code, message, data } = await BillsService.deleteBill({
    id: id,
  });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getDetailBill = async (req, res, next) => {
  const { id } = req.params;
  const { status, status_code, message, data } =
    await BillsService.getDetailBill({ id: id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = {
  createBill,
  getBillsByHotelId,
  getBillOrderById,
  deleteBillById,
  getAllBills,
  getDetailBill,
};
