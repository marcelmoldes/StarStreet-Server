var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

require("./src/routes/clients.js")(app);
require("./src/routes/categories.js")(app);
require("./src/routes/items.js")(app);
require("./src/routes/favorites.js")(app);
require("./src/routes/comments.js")(app);
require("./src/routes/orders.js")(app);


require("./src/routes/cart.js")(app);

app.listen(8081);

console.log("Server WORKING!!!");
