const { Sequelize, DataTypes } = require("sequelize");
const { Images } = require("./Images");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});
const Items = sequelize.define("items", {
  title: DataTypes.STRING,
  price: DataTypes.STRING,
  slug: DataTypes.STRING,
  category_id: DataTypes.NUMBER,
});

Items.hasMany(Images, {
  foreignKey: "item_id"
})

module.exports = {
  Items,
};
