const { Orders } = require("../models/Orders.js");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const { Cart } = require("../models/Cart.js");
const { Items } = require("../models/Items.js");
const { Images } = require("../models/Images.js");
const { OrderDetails } = require("../models/OrderDetails.js");
const { Clients } = require("../models/Clients.js");
const { Op } = require("sequelize");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
          shipping_status: "Not shipped",
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
      const data = {
        to: order.email,
        from: 'moldesmarcel41@gmail.com', 
        templateId: 'd-c65d3ca8dac249438da38f2796601ee9',
        personalizations: [{
          to: [{ email: order.email }],
          dynamic_template_data: {
            First_Name: order.first_name,
            Order_Number: order.id
          }
        }]
      };
      try {
        await sgMail.send(data);
      } catch (error) {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      }
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

      const order = await Orders.findByPk(req.params.id, {
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

  async updateOrder(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);

      if (!client || client.role !== "admin") {
        return res.send({
          success: false,
        });
      }
      const order = await Orders.findByPk(req.params.id);
      order.shipping_status = req.body.shipping_status;
      order.shipping_company = req.body.shipping_company;
      order.tracking_number = req.body.tracking_number;
      order.first_name = req.body.first_name;
      order.last_name = req.body.last_name;
      order.address = req.body.address;
      order.city = req.body.city;
      order.state = req.body.state;
      order.email = req.body.email;
      order.phone = req.body.phone;
      order.order_number = req.body.order_number;
      order.createdAt = req.body.createdAt;

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

  async getOrderHistory(req, res) {
    try {
   const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client || client.role !== "admin") {
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

  async getOrders(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client || client.role !== "admin") {
        return res.send({
          success: false,
        });
      }
      let where = {}
      if(req.query.client_id) {
        where = {
          client_id: req.query.client_id
        }
      }
      const orders = await Orders.findAll({
        where,
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

  async getStats(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client || client.role !== "admin") {
        return res.send({
          success: false,
        });
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const where = {
        createdAt: {
          [Op.gt]: startOfMonth,
        },
      };
      const orderCount = await Orders.count({
        where,
      });
      const revenue = await Orders.sum("total", {
        where,
      });
      const clients = await Orders.count({
        distinct: true,
        col: "client_id",
        where,
      });

      const stats = {
        revenue,
        orders: orderCount,
        clients,
        average_order_value: Math.round(revenue / orderCount),
        sales_history: [],
      };
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
};
