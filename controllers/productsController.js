const ProductService = require("../services/productsService");

const createProduct = async (req, res, next) => {
  const { name } = req.body;

  const { status, status_code, message, data } =
    await ProductService.createProduct({ name: name });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  console.log(id);
  const { status, status_code, message, data } =
    await ProductService.updateProduct({ id: id, name: name });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  const { status, status_code, message, data } =
    await ProductService.deleteProduct({ id });

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

const getAllProducts = async (req, res, next) => {
  const { status, status_code, message, data } =
    await ProductService.getAllProducts();

  res.status(status_code).send({
    status: status,
    status_code: status_code,
    message: message,
    data: data,
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
