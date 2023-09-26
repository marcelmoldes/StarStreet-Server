const { Clients } = require("../models/Users.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";

module.exports = {
  async createClient(req, res) {
    try {
      const emailFound = await Clients.findOne({
        where: {
          email: req.body.email,
        },
      });

      const clientFound = await Clients.findOne({
        where: {
          client_name: req.body.client_name,
        },
      });
      const phoneFound = await Clients.findOne({
        where: {
          phone: req.body.phone,
        },
      });
      if (emailFound || clientFound || phoneFound) {
        return res.send({
          success: false,
          error: "This user already exists!",
        });
      } else {
        const client = await Clients.create(req.body);
        return res.send({
          success: true,
          client,
        });
      }
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },

  async getClients(req, res) {
    try {
      const clients = await Clients.findAll();
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
  async getClient(req, res) {
    try {
      const client = await Clients.findByPk(req.params.id);
      return res.send({
        success: true,
        client,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async login(req, res) {
    try {
      const client = await Clients.findOne({
        where: {
          email: req.body.email,
          password: req.body.password,
        },
      });

      if (client) {
        let token = jwt.sign(client.toJSON(), jwtSecret);
        client.set("password", null);
        return res.send({
          client: client,
          token,
          success: true,
        });
      } else {
        return res.send({
          success: false,
          error: "This password or email are incorrects",
        });
      }
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
