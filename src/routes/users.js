const UsersController = require("../controllers/UsersController.js");

module.exports = (app) => {
  app.get("/users", UsersController.getUsers);
  app.get("/users/:id", UsersController.getUser);
  app.post("/users", UsersController.createUser)
  app.post("/users/login", UsersController.login)
};

