const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Users = sequelize.define("users", {
  user_name: DataTypes.ARRAY,
  phone: DataTypes.NUMBER,
  email: DataTypes.ARRAY,
  password: DataTypes.ARRAY,
});

module.exports = {
  Users,
};
