const CategoriesController = require("../controllers/CategoriesController.js");

module.exports = (app) => {
  app.get("/categories", CategoriesController.getCategories);
  app.get("/categories/:slug", CategoriesController.getCategory);
  app.post("/categories", CategoriesController.createCategory);
};
