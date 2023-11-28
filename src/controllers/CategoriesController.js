const { Categories } = require("../models/Categories.js");
const { Favorites } = require("../models/Favorites.js");
const { Items } = require("../models/Items.js");
const { Sequelize } = require("sequelize");
const { Clients } = require("../models/Clients.js");
const sequelize = new Sequelize("StarStreet", "root", "password", {
  dialect: "mysql",
});
const jwt = require("jsonwebtoken");
const { Images } = require("../models/Images.js");

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  async createCategory(req, res) {
    try {
      const category = await Categories.create(req.body);
      return res.send({
        success: true,
        category,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },

  async getCategories(req, res) {
    try {
      const categories = await Categories.findAll();

      return res.send({
        success: true,
        categories,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async getCategory(req, res) {
    try {
      const category = await Categories.findOne({
        where: {
          slug: req.params.slug,
        },
      });

      let client;
      try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.replace("Bearer ", "");
        client = jwt.decode(token, jwtSecret);
      } catch (error) {
        client = false;
      }

      let items;
      if (client) {
        items = await Items.findAll({
          where: {
            category_id: category.id,
          },
          include: {
            model: Images,
            
          },
          order: [
            ["id", "ASC"],
            [Images, "id", "ASC"],
          ],
          attributes: {
            include: [
              [
                sequelize.literal(`(
                      SELECT COUNT(*) 
                      FROM favorites AS favorite
                      WHERE
                          favorite.item_id = items.id AND favorite.client_id = ${client.id}
                  )`),
                "favorite",
              ],
            ],
          },
        });
      } else {
        items = await Items.findAll({
          where: {
            category_id: category.id,
          },
          order: [[Images, "id", "ASC"]],
          include: {
            model: Images,
          },
        });
      }
      return res.send({
        success: true,
        category,
        items,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async getCategoryAdmin(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);

      if (!client || client.role !== "admin") {
        return res.send({
          success: false,
        });
      }
      const category = await Categories.findByPk(req.params.id);
      return res.send({
        success: true,
        category,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);

      if (!client || client.role !== "admin") {
        return res.send({
          success: false,
        });
      }
      const category = await Categories.findByPk(req.params.id);
      category.title = req.body.title;
      category.slug = req.body.slug;
      category.description = req.body.description;

      await category.save();

      return res.send({
        success: true,
        category,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },

  async deleteCategory(req, res) {
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
      const categoryFound = await Categories.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!categoryFound) {
        return res.send({
          success: false,
          error: "Category not found",
        });
      }
      const deleteCategory = await Categories.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.send({
        succes: true,
        deleteCategory,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
