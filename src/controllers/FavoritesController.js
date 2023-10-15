const { Favorites } = require("../models/Favorites.js");
const { Items } = require("../models/Items.js");
const jwt = require("jsonwebtoken");
const { Images } = require("../models/Images.js");

const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";

module.exports = {
  async getFavorites(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const favorites = await Favorites.findAll({
        where: {
          client_id: client.id,
        },
        include: {
          model: Items,

          include: {
            model: Images,
          },
        },
      });
      return res.send({
        success: true,
        favorites,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async createFavorite(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      // Check it if Item exists or not
      const itemExists = await Items.findOne({
        where: {
          id: req.body.item_id,
        },
      });
      if (!itemExists) {
        return res.send({
          success: false,
          error: "Item doesnt exists",
        });
      }
      // Check it if favorite exists
      const favoriteExists = await Favorites.findOne({
        where: {
          client_id: client.id,
          item_id: req.body.item_id,
        },
      });
      if (favoriteExists) {
        return res.send({
          success: false,
          error: "This favorite already exists",
        });
      }
      const favorite = await Favorites.create({
        client_id: client.id,
        item_id: req.body.item_id,
      });
      return res.send({
        success: true,
        favorite_id: favorite.id,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error,
      });
    }
  },
  async deleteFavorite(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const favoriteRemoved = await Favorites.findOne({
        where: {
          client_id: client.id,
          item_id: req.params.item_id,
        },
      });
      if (!favoriteRemoved) {
        return res.send({
          success: false,
          error: "Favorite removed",
        });
      }
      const remove = await Favorites.destroy({
        where: {
          item_id: req.params.item_id,
          client_id: client.id,
        },
      });
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
