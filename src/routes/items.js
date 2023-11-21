const ItemsController = require("../controllers/ItemsController.js");
const { Items } = require("../models/Items.js");
module.exports = (app) => {
  app.get("/items/:slug", ItemsController.getItem);
  app.post("/items", ItemsController.createItem);
  app.put("/admin/item/:id", ItemsController.updateItem);
  app.delete("/admin/items/:id", ItemsController.deleteItem);
  app.get("/admin/items", ItemsController.getItems);
  app.get("/admin/item/:id", ItemsController.getAdminItem);
};
