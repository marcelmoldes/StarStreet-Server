const { Comments } = require("../models/Comments.js");
const { Items } = require("../models/Items.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "290eu38f9hcefhsfaebesufbeaufeuyfgr8ygagtvdbkloigruoi";

module.exports = {
  async createComment(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const itemExists = await Items.findOne({
        where: {
          id: req.body.item_id,
        },
      });
      if (!itemExists) {
        return res.send({
          success: false,
          error: "Item doesnt exist",
        });
      }
      const comment = await Comments.create({
        item_id: req.body.item_id,
        client_id: client.id,
        message: req.body.message,
      });
      return res.send({
        success: true,
        comment_id: comment.id,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Failed comment",
      });
    }
  },

  async deleteComment(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.replace("Bearer ", "");
      const client = jwt.decode(token, jwtSecret);
      if (!client) {
        return res.send({
          success: false,
        });
      }
      const clientComment = await Comments.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!clientComment) {
        return res.send({
          success: false,
          error: "Comment not found",
        });
      }
      if (clientComment.client_id !== client.id) {
        return res.send({
          success: false,
          error: "You dont have permission to delete this  comment",
        });
      }
      const result = await Comments.destroy({
        where: {
          id: req.params.id,
        },
      });

      return res.send({
        success: true,
        result,
      });
    } catch (error) {
      return res.send({
        success: false,
        error: "Authentication failed",
      });
    }
  },
};
