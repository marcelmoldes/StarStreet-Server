const { Sequelize, DataTypes } = require("sequelize");
const { Clients } = require("./Clients.js");
const { OrderDetails } = require("./OrderDetails.js");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Orders = sequelize.define("orders", {
  email: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  card_number: DataTypes.NUMBER,
  expiration_date: DataTypes.NUMBER,
  cvc: DataTypes.NUMBER,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  postal_code: DataTypes.NUMBER,
  card_name: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  client_id: DataTypes.NUMBER,
  total: DataTypes.NUMBER,
  subtotal: DataTypes.NUMBER,
  taxes: DataTypes.NUMBER,
  shipping: DataTypes.NUMBER,
  state: DataTypes.STRING,
  shipping_status: DataTypes.STRING,
  shipping_company: DataTypes.STRING,
  tracking_number: DataTypes.STRING,
  order_number: DataTypes.NUMBER
  
});

Orders.hasMany(OrderDetails, {
  foreignKey: {
    name: "order_id",
  },
});
Orders.belongsTo(Clients, {
  foreignKey: {
    name: "client_id",
  },
});

module.exports = {
  Orders,
};
