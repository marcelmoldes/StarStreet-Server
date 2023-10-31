const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});
const Images = sequelize.define("images", {
  url: DataTypes.STRING,
  item_id: DataTypes.NUMBER,
});

module.exports = {
  Images,
};
