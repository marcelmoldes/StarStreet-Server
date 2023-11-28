const { Cart } = require("../models/Cart.js");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const { Items } = require("../models/Items.js");
const { Images } = require("../models/Images.js");

module.exports = {
  async getCart(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const cart = await Cart.findAll({
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
        cart,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async createCart(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      let item = await Items.findOne({
        where: {
          id: req.body.item_id,
        },
      });
      if (!item) {
        return res.send({
          success: false,
          error: "This item doesnt exists",
        });
      }
      // if item doesnt exist return error
      let cart = await Cart.findOne({
        where: {
          client_id: client.id,
          item_id: req.body.item_id,
        },
      });
      if (!cart) {
        cart = await Cart.create({
          client_id: client.id,
          item_id: req.body.item_id,
          quantity: 1,
        });
      } else {
        cart.quantity = cart.quantity + 1;
        cart.save();
      }
      return res.send({
        success: true,
        cart,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async deleteCart(req, res) {
    try {
      let remove;
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
          error: error.message,
        });
      }
      let cart = await Cart.findOne({
        where: {
          client_id: client.id,
          item_id: req.params.item_id,
        },
      });
      if (!cart) {
        return res.send({
          success: false,
          error: "Item Cart doesnt exist",
        });
      }
      if (cart.quantity > 1) {
        cart.quantity = cart.quantity - 1;
        cart.save();
      } else {
        remove = await Cart.destroy({
          where: {
            item_id: req.params.item_id,
            client_id: client.id,
            quantity: 1,
          },
        });
      }

      return res.send({
        success: true,
        remove,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
