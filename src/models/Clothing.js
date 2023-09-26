const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Clothing = sequelize.define("clothings", {
  photo_url: DataTypes.STRING,
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
});

module.exports = {
  Clothing,
};
