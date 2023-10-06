const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Clients = sequelize.define("clients", {
  client_name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  image_profile: DataTypes.STRING
});

module.exports = {
  Clients,
};

