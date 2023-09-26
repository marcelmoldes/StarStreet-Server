const ClientsController = require("../controllers/ClientsController.js");

module.exports = (app) => {
  app.get("/clients", ClientsController.getClients);
  app.get("/clients/:id", ClientsController.getClient);
  app.post("/clients", ClientsController.createClient)
  app.post("/clients/login", ClientsController.login)
};

