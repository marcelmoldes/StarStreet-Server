const { Sequelize, DataTypes } = require("sequelize");
const { Items } = require("./Items.js");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const OrderDetails = sequelize.define("order_details", {
  order_id: DataTypes.NUMBER,
  item_id: DataTypes.NUMBER,
  title: DataTypes.STRING,
  price: DataTypes.NUMBER,
  quantity: DataTypes.NUMBER,
});

OrderDetails.belongsTo(Items, {
  foreignKey: "item_id",
});

module.exports = {
  OrderDetails,
};
