const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Favorites = sequelize.define("favorites", {
  client_id: DataTypes.NUMBER,
  item_id: DataTypes.NUMBER,
});

module.exports = {
  Favorites,
};
