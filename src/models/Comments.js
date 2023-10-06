const { Sequelize, DataTypes } = require("sequelize");
const { Clients } = require("./Clients");

const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

const Comments = sequelize.define("comments", {
  item_id: DataTypes.NUMBER,
  client_id: DataTypes.NUMBER,
  message: DataTypes.STRING,
});

Comments.belongsTo(Clients, {
    foreignKey: {
        name: "client_id"
    }
})

module.exports = {
  Comments,
};
