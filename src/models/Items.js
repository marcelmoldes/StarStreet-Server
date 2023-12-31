const { Sequelize, DataTypes } = require("sequelize");
const { Comments } = require("./Comments");
const { Images } = require("./Images");

const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});
const Items = sequelize.define("items", {
  title: DataTypes.STRING,
  price: DataTypes.NUMBER,
  slug: DataTypes.STRING,
  category_id: DataTypes.NUMBER,
  description: DataTypes.STRING
});

Items.hasMany(Images, {
  foreignKey: "item_id",
});

Items.hasMany(Comments, {
  foreignKey: "item_id",
});

module.exports = {
  Items,
};
