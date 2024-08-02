const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 2500;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// controllers
const usersController = require("./controllers/usersController");
const billsController = require("./controllers/billsController");
const hotelsController = require("./controllers/hotelsController");
const ordersController = require("./controllers/ordersController");
const productsController = require("./controllers/productsController");

// middlewares
const middlewares = require("./middlewares/authentication");

//endpoint api routes
// users routes
app.post("/api/v1/user/login", usersController.login);
app.post("/api/v1/user/register", usersController.register);
app.get(
  "/api/v1/user/current",
  middlewares.authenticate,
  usersController.currentUser
);
// end users routes

// bills routes
app.post(
  "/api/v2/bills/create",
  middlewares.authenticate,
  billsController.createBill
);
app.get(
  "/api/v2/bills/details/:id",
  middlewares.authenticate,
  billsController.getDetailBill
);

app.get(
  "/api/v2/bills/detail",
  middlewares.authenticate,
  billsController.getAllBills
);
app.get(
  "/api/v2/bills/list/:id",
  middlewares.authenticate,
  billsController.getBillOrderById
);
app.delete(
  "/api/v2/bills/delete/:id",
  middlewares.authenticate,
  billsController.deleteBillById
);
// end bills routes

// hotels routes
app.post(
  "/api/v3/hotels/create",
  middlewares.authenticate,
  hotelsController.createHotel
);
app.put(
  "/api/v3/hotels/update/:id",
  middlewares.authenticate,
  hotelsController.editHotel
);
app.put(
  "/api/v3/hotels/update/paid/:id",
  middlewares.authenticate,
  hotelsController.editHotelPaid
);

app.put(
  "/api/v3/hotels/paid/:id",
  middlewares.authenticate,
  hotelsController.updateHotelPaid
);

app.delete(
  "/api/v3/hotels/delete/:id",
  middlewares.authenticate,
  hotelsController.deleteHotel
);
app.get(
  "/api/v3/hotels",
  middlewares.authenticate,
  hotelsController.getAllHotels
);
app.get(
  "/api/v3/details/hotels/:id",
  middlewares.authenticate,
  hotelsController.getDetailHotels
);
// end hotel routes

// orders routes
app.put("/api/v4/orders/update/:id", ordersController.updateBillById);
app.post("/api/v4/orders/created", ordersController.createOrders);
// end orders routes

// products routes
app.post(
  "/api/v5/products/create",
  middlewares.authenticate,
  productsController.createProduct
);
app.get(
  "/api/v5/products",
  middlewares.authenticate,
  productsController.getAllProducts
);
app.put(
  "/api/v5/products/update/:id",
  // middlewares.authenticate,
  productsController.updateProduct
);
app.delete(
  "/api/v5/products/delete/:id",
  middlewares.authenticate,
  productsController.deleteProduct
);
// end products routes

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
