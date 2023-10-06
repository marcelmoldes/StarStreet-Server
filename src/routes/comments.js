const CommentsController = require("../controllers/CommentsController.js");

module.exports = (app) => {
  app.post("/comments", CommentsController.createComment);
  app.delete("/comments/:id", CommentsController.deleteComment);
};
