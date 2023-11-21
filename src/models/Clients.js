const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Clients = sequelize.define("clients", {
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  profile_image: DataTypes.STRING,
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  postal_code: DataTypes.NUMBER,
  country_code: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  role:DataTypes.STRING,

});

module.exports = {
  Clients,
};
