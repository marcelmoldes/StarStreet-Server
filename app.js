var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

require("./src/routes/users.js")(app);
require("./src/routes/clothing.js")(app);
require("./src/routes/items.js")(app);


app.listen(8081);

console.log("Server WORKING!!!");
