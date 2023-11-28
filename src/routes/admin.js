const AdminController = require("../controllers/AdminController.js");

module.exports = (app) => {
  app.get("/admin/stats", AdminController.getStats);
  app.get("/admin/clients", AdminController.getClients);
};
