const CartController = require("../controllers/CartController.js");

module.exports = (app) => {
  app.get("/cart", CartController.getCart);
  app.post("/cart", CartController.createCart);
  app.delete("/cart/:item_id", CartController.deleteCart);
};
