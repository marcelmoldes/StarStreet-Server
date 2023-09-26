const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});
const Items = sequelize.define("items", {
    image: DataTypes.STRING,
    title: DataTypes.STRING,
    price: DataTypes.STRING,
    slug: DataTypes.STRING,
    clothing_id:DataTypes.NUMBER

});

module.exports = {
  Items,
};
