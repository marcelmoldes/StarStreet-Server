const jwt = require("jsonwebtoken");
const { Orders } = require("../models/Orders.js");
const { Clients } = require("../models/Clients.js");
const jwtSecret = process.env.JWT_SECRET;
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});

module.exports = {
  async getStats(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);

      const clientFound = await Clients.findByPk(req.params.id);
      if (client.role !== "admin" && client.id !== clientFound.id) {
        return res.send({
          success: false,
          error: "Access denied",
        });
      }
      let stats = await sequelize.query(
        "SELECT SUM(total) as total, MONTH(createdAt) as month, YEAR(createdAt) as year FROM StarStreet.orders GROUP BY YEAR(createdAt), month(createdAt) order by YEAR(createdAt), MONTH(createdAt);"
      );
      stats = stats[0].map((stat) => {
        return {
          label: `${stat.month}-${stat.year}`,
          total: stat.total,
        };
      });
      return res.send({
        success: true,
        stats,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async getClients(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);

      const clientFound = await Clients.findByPk(req.params.id);
      if (client.role !== "admin" && client.id !== clientFound.id) {
        return res.send({
          success: false,
          error: "Access denied",
        });
      }
      let clients = await sequelize.query(
        "SELECT COUNT(id) as id, MONTH(createdAt) as month, YEAR(createdAt) as year FROM StarStreet.clients GROUP BY YEAR(createdAt), month(createdAt) order by YEAR(createdAt), MONTH(createdAt);"
      );
      clients = clients[0].map((client) => {
        return {
          label: `${client.month}-${client.year}`,
          id: client.id,
        };
      });
      return res.send({
        success: true,
        clients,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
