const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});


const Orders = sequelize.define("orders", {
  email: DataTypes.STRING,
  full_name: DataTypes.STRING,
  card_number: DataTypes.NUMBER,
  expiration_date: DataTypes.NUMBER,
  cvc: DataTypes.NUMBER,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  province: DataTypes.STRING,
  postal_code: DataTypes.NUMBER,
  card_name: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  client_id: DataTypes.NUMBER,
  total: DataTypes.NUMBER,
  subtotal: DataTypes.NUMBER,
  taxes: DataTypes.NUMBER,
  shipping: DataTypes.NUMBER,

});








module.exports = {
  Orders,
};