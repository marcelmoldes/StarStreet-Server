const { Clients } = require("../models/Clients.js");
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
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        },
      });

      if (emailFound || clientFound) {
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

  async updateClient(req, res) {
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
      clientFound.first_name = req.body.first_name;
      clientFound.last_name = req.body.last_name;
      clientFound.email = req.body.email;
      clientFound.address = req.body.address;
      clientFound.city = req.body.city;
      clientFound.state = req.body.state;
      clientFound.postal_code = req.body.postal_code;
      clientFound.country_code = req.body.country_code;
      clientFound.phone = req.body.phone;
      clientFound.save();

      return res.send({
        success: true,
        client: clientFound,
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
    
      return res.send({
        success: true,
        client: clientFound,
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
