const { Orders } = require("../models/Orders.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";
const { Items } = require("../models/Items.js");
const { Images } = require("../models/Images.js");


module.exports = {
  async createOrder(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }

      const order = await Orders.create(req.body);
      return res.send({
        success: true,
        order,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async getOrder(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const order = await Orders.findAll({
        where: {
          client_id: client.id,
        },
        include: {
          model: Items,
          include: Images,

        },
    
    
      });
      return res.send({
        success: true,
        order,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
