const OrdersController = require("../controllers/OrdersController.js");
const { Orders } = require("../models/Orders.js");

module.exports = (app) => {
  app.post("/order", OrdersController.createOrder);
  app.get("/orders", OrdersController.getOrders);
  app.get("/orders/history", OrdersController.getOrderHistory);
  app.get("/orders/stats", OrdersController.getStats);
  app.get("/orders/:id", OrdersController.getOrder);
};
