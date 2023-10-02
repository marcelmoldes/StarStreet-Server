const FavoritesController = require("../controllers/FavoritesController.js");

module.exports = (app) => {
  app.get("/favorites", FavoritesController.getFavorites);
  app.post("/favorites", FavoritesController.createFavorite);
  app.delete("/favorites/:id", FavoritesController.deleteFavorite);
};
