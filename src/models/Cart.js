const { Sequelize, DataTypes } = require("sequelize");
const { Items } = require("./Items");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Cart = sequelize.define("carts", {
  client_id: DataTypes.NUMBER,
  item_id: DataTypes.NUMBER,
  quantity: DataTypes.NUMBER,
});

Cart.belongsTo(Items, {
  foreignKey: {
    name: "item_id",
  },
});

module.exports = {
  Cart,
};
