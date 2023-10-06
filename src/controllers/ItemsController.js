const { Items } = require("../models/Items");
const { Favorites } = require("../models/Favorites.js");
const jwt = require("jsonwebtoken");
const { Images } = require("../models/Images");
const { Comments } = require("../models/Comments.js");
const { Clients } = require("../models/Clients.js");
const { Cart } = require("../models/Cart.js");

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
              attributes: ["image_profile", "client_name", "createdAt"],
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
};

