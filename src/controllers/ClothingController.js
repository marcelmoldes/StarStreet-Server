const { Clothing } = require("../models/Clothing.js");
const { Items } = require("../models/Items.js");


module.exports = {
  async createClothing(req, res) {
    try {
      const clothing = await Clothing.create(req.body);
      return res.send({
        success: true,
        clothing,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },

  async getClothing(req, res) {
    try {
      const clothing = await Clothing.findAll();

       return res.send({
        success: true,
        clothing,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
  async getOneClothing(req, res) {
    try {
      const clothing = await Clothing.findOne({
        where: {
          slug: req.params.slug,
        },
      });
      const items = await Items.findOne({
        where: {
          clothing_id: clothing.id,
        },
      });
      return res.send({
        success: true,
        clothing,
        items,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: error.message,
      });
    }
  },
};
