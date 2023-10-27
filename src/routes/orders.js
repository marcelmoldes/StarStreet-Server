const OrdersController = require("../controllers/OrdersController.js");

module.exports = (app) => {
  app.post("/order", OrdersController.createOrder);
  app.get("/orders", OrdersController.getOrders);
  app.get('/orders/:order_id',OrdersController.getOrder)
};
