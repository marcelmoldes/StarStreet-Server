const ItemsController = require ("../controllers/ItemsController.js")
module.exports = (app) => {
  app.get("/items/:slug", ItemsController.getItem);
  app.post("/items", ItemsController.createItem);
  
  
};
