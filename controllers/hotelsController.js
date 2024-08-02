const HotelService = require("../services/hotelsService");

const createHotel = async (req, res) => {
  const { hotelName } = req.body;

  const { status, status_code, message, data } = await HotelService.createHotel(
    { hotelName: hotelName }
  );

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const editHotel = async (req, res, next) => {
  const { hotelName } = req.body;
  const { id } = req.params;

  const { status, status_code, message, data } = await HotelService.editHotel({
    id,
    hotelName,
  });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const editHotelPaid = async (req, res, next) => {
  const { totalPaid } = req.body;
  const { id } = req.params;

  const { status, status_code, message, data } =
    await HotelService.editHotelPaid({
      id,
      totalPaid,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateHotelPaid = async (req, res, next) => {
  const { totalPaid } = req.body;
  const { id } = req.params;

  const { status, status_code, message, data } =
    await HotelService.updateHotelPaid({
      id,
      totalPaid,
    });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const deleteHotel = async (req, res, next) => {
  const { id } = req.params;

  const { status, status_code, message, data } = await HotelService.deleteHotel(
    {
      id,
    }
  );

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllHotels = async (req, res) => {
  const { status, status_code, message, data } =
    await HotelService.getAllHotel();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getDetailHotels = async (req, res) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await HotelService.getDetailHotels({ id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = {
  createHotel,
  editHotel,
  editHotelPaid,
  deleteHotel,
  getAllHotels,
  getDetailHotels,
  updateHotelPaid,
};
