const ItemsController = require("../controllers/ItemsController.js");
const { Items } = require("../models/Items.js");
module.exports = (app) => {
  app.get("/items/:slug", ItemsController.getItem);
  app.post("/admin/items", ItemsController.createItem);
  app.put("/admin/items/:id", ItemsController.updateItem);
  app.delete("/admin/items/:id", ItemsController.deleteItem);
  app.get("/admin/items", ItemsController.getItems);
  app.get("/admin/items/:id", ItemsController.getAdminItem);
};
