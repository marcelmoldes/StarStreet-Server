const { Sequelize, DataTypes } = require("sequelize");
const { Items } = require("../models/Items");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Favorites = sequelize.define("favorites", {
  client_id: DataTypes.NUMBER,
  item_id: DataTypes.NUMBER,
});

Favorites.belongsTo(Items, {
  foreignKey: {
    name: "item_id",
  },
});

module.exports = {
  Favorites,
};
