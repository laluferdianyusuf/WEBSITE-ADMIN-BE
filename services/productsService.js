const ProductRepo = require("../repositories/productRepo");

class ProductService {
  static async createProduct({ name }) {
    try {
      if (!name) {
        return {
          status: false,
          status_code: 400,
          message: "Product name is required",
          data: {
            product: null,
          },
        };
      }

      const createProduct = await ProductRepo.createProduct({
        name: name,
      });

      return {
        status: true,
        status_code: 201,
        message: "Product created successfully",
        data: {
          product: createProduct,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error creating product" + error.message,
        data: {
          product: null,
        },
      };
    }
  }

  static async updateProduct({ id, name }) {
    try {
      if (!name) {
        return {
          status: false,
          status_code: 400,
          message: "Product name is required",
          data: {
            product: null,
          },
        };
      }
      const updateProduct = await ProductRepo.updateProduct({
        name: name,
        id,
      });

      return {
        status: true,
        status_code: 201,
        message: "Product updated successfully",
        data: {
          product: updateProduct,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error updating product" + error.message,
        data: {
          product: null,
        },
      };
    }
  }

  static async deleteProduct({ id }) {
    try {
      const deleteProduct = await ProductRepo.deleteProduct({ id });
      return {
        status: true,
        status_code: 200,
        message: "Product deleted successfully",
        data: {
          product: deleteProduct,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error deleting product" + error.message,
        data: {
          product: null,
        },
      };
    }
  }

  static async getAllProducts() {
    try {
      const getProducts = await ProductRepo.getAllProducts();

      if (getProducts) {
        return {
          status: true,
          status_code: 200,
          message: "Products",
          data: {
            product: getProducts,
          },
        };
      } else {
        return {
          status: false,
          status_code: 404,
          message: "Product not found",
          data: {
            product: null,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: "Error getting products" + error.message,
        data: {
          product: null,
        },
      };
    }
  }
}

module.exports = ProductService;
