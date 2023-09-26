const ClothingController = require("../controllers/ClothingController.js");

module.exports = (app) => {
  app.get("/clothing", ClothingController.getClothing);
  app.get("/clothing/:slug", ClothingController.getOneClothing);
  app.post("/clothing", ClothingController.createClothing);
};
