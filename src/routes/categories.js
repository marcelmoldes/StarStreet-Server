const CategoriesController = require("../controllers/CategoriesController.js");

module.exports = (app) => {
  app.get("/categories", CategoriesController.getCategories);
  app.get("/categories/:slug", CategoriesController.getCategory);
  app.post("/admin/categories", CategoriesController.createCategory);
app.delete('/admin/categories/:id',CategoriesController.deleteCategory);
app.put('/admin/category/:id',CategoriesController.updateCategory)
app.get("/admin/category/:id", CategoriesController.getCategoryAdmin);
};
