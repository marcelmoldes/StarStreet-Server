const { Items } = require("../models/Items");
const { Favorites } = require("../models/Favorites.js");
const jwt = require("jsonwebtoken");
const { Images } = require("../models/Images");
const { Comments } = require("../models/Comments.js");
const { Clients } = require("../models/Clients.js");

const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";

module.exports = {
  async createItem(req, res) {
    try {
      const slugFound = await Items.findOne({
        where: {
          slug: req.body.slug,
        },
      });
      if (slugFound) {
        return res.send({
          success: false,
          error: "Slug exists",
        });
      }
      const item = await Items.create(req.body);
      return res.send({
        success: true,
        item,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },

  async getItem(req, res) {
    try {
      let item = await Items.findOne({
        where: {
          slug: req.params.slug,
        },
        include: [
          {
            model: Images,
          },
          {
            model: Comments,
            include: {
              model: Clients,
              attributes: [
                "profile_image",
                "first_name",
                "last_name",
                "createdAt",
              ],
            },
          },
        ],
      });

      let client;
      try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.replace("Bearer ", "");
        client = jwt.decode(token, jwtSecret);
      } catch (error) {
        client = false;
      }

      let favoriteFound;
      if (client) {
        favoriteFound = await Favorites.findOne({
          where: {
            client_id: client.id,
            item_id: item.id,
          },
        });
        if (favoriteFound) {
          item.setDataValue("favorite", favoriteFound ? 1 : 0);
        }
      }
      return res.send({
        success: true,
        item,
      });
    } catch (error) {
      return res.send({
        succes: false,
        error: error.message,
      });
    }
  },
  async deleteItem(req, res) {
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
      const itemFound = await Items.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!itemFound) {
        return res.send({
          success: false,
          error: "Item not found",
        });
      }

      const removeItem = await Items.destroy({
        where: {
          id: req.params.id,
        },
      });

      return res.send({
        success: true,
        removeItem,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async updateItem(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);

      if (!client || client.role !== "admin") {
        return res.send({
          success: false,
        });
      }
      const item = await Items.findByPk(req.params.id);
      item.title = req.body.title;
      item.price = req.body.price;
      item.slug = req.body.slug;

      item.createdAt = req.body.createdAt;
      await item.save();

      return res.send({
        success: true,
        item,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async getItems(req, res) {
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
      const items = await Items.findAll();
      return res.send({
        success: true,
        items,
      });
    } catch (error) {
      return res.send({
        succes: false,
        error: error.message,
      });
    }
  },
  async getAdminItem(req, res) {
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
      const item = await Items.findByPk(req.params.id);
      return res.send({
        success: true,
        item,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
