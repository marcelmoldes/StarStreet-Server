const { Orders } = require("../models/Orders.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";
const { Cart } = require("../models/Cart.js");
const { Items } = require("../models/Items.js");
const { Images } = require("../models/Images.js");
const { OrderDetails } = require("../models/OrderDetails.js");
const { Clients } = require("../models/Clients.js");

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

      req.body.total = 0;
      req.body.subtotal = 0;
      req.body.taxes = 0;
      req.body.shipping = 0;
      const order = await Orders.create(req.body);

      const cartItems = await Cart.findAll({
        where: {
          client_id: client.id,
        },
        include: Items,
      });

      let subtotal = 0;
      let total = 0;
      let shipping = 0;
      let taxes = 0;
      for (let cartItem of cartItems) {
        const orderDetail = {
          order_id: order.id,
          item_id: cartItem.item_id,
          title: cartItem.item.title,
          price: cartItem.item.price,
          quantity: cartItem.quantity,
        };
        await OrderDetails.create(orderDetail);
        subtotal = subtotal + cartItem.quantity * cartItem.item.price;
        shipping = shipping + cartItem.quantity * 5;
      }
      taxes = Math.round(subtotal * 0.1);
      total = subtotal + taxes + shipping;

      order.subtotal = subtotal;
      order.shipping = shipping;
      order.taxes = taxes;
      order.total = total;
      await order.save();

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

      const order = await Orders.findOne({
        where: {
          client_id: client.id,
        },
        include: [
          {
            model: Clients,
          },
          {
            model: OrderDetails,
            include: {
              model: Items,
              include: Images,
            },
          },
        ],
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

  async getOrders(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const orders = await Orders.findAll({
        where: {
          client_id: client.id,
        },
        include: [
          {
            model: Clients,
          },
          {
            model: OrderDetails,
            include: {
              model: Items,
              include: Images,
            },
          },
        ],
      });
      return res.send({
        success: true,
        orders,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
