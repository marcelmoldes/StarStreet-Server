const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Categories = sequelize.define("categories", {
  photo_url: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  slug: DataTypes.STRING,
});

module.exports = {
  Categories,
};
