const OrdersController = require("../controllers/OrdersController.js");

module.exports = (app) => {
  app.post("/order", OrdersController.createOrder);
  app.get("/order", OrdersController.getOrder);
  
};
