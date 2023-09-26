const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Clients = sequelize.define("clients", {
  client_name: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = {
  Clients,
};
