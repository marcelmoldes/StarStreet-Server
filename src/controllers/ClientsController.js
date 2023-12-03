const { Clients } = require("../models/Clients.js");
const jwt = require("jsonwebtoken");
const { Orders } = require("../models/Orders.js");
const { email } = require("@vuelidate/validators");
const jwtSecret = process.env.JWT_SECRET;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fileType = require("file-type");
const base64Img = require("base64-img");
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
      clientFound.role = req.body.role;

      if (req.body.imageBase64) {
        const fileData = req.body.imageBase64;
        const fileName = `client-${client.id}`;
        const folder = "./public/images";
        const imagePath = base64Img.imgSync(fileData, folder, fileName);

        clientFound.profile_image =
          "http://localhost:8081/images/" + fileName + ".jpg";
      }

      await clientFound.save();

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

  async changePassword(req, res) {
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
      if (clientFound.password !== req.body.currentPassword) {
        return res.send({
          success: false,
          error: "You must provide your current password",
        });
      }
      clientFound.password = req.body.newPassword;
      clientFound.save();

      return res.send({
        success: true,
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
  async forgotPassword(req, res) {
    try {
      const client = await Clients.findOne({
        where: {
          email: req.body.email,
        },
      });
      if (!client) {
        return res.send({
          success: false,
          error: "This account does not exist, please try again",
        });
      }
      const new_password = Math.random().toString(36).substring(2, 18);

      client.password = new_password;
      client.save();
      const data = {
        to: client.email,
        from: "moldesmarcel41@gmail.com",
        templateId: "d-f698d27f8c5f4bc7bf1b4b5c95cc1733",
        personalizations: [
          {
            to: [{ email: client.email }],
            dynamic_template_data: {
              First_Name: client.first_name,
              Password: client.password,
            },
          },
        ],
      };
      try {
        const result = await sgMail.send(data);
      } catch (error) {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
      return res.send({
        success: true,
        new_password,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
