const { products } = require("../models");

class ProductRepo {
  static async createProduct({ name }) {
    const createProduct = await products.create({ name: name });

    return createProduct;
  }

  static async updateProduct({ id, name }) {
    const updateProduct = await products.update(
      { name: name },
      { where: { id: id } }
    );
    return updateProduct;
  }

  static async deleteProduct({ id }) {
    const deleteProduct = await products.destroy({ where: { id: id } });
    return deleteProduct;
  }

  static async getProductById({ id }) {
    const getProduct = await products.findOne({ where: { id: id } });
    return getProduct;
  }

  static async getAllProducts() {
    const getProducts = await products.findAll();
    return getProducts;
  }
}

module.exports = ProductRepo;
