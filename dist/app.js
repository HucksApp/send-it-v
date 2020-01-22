"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _headers = require("./config/headers.js");

var _createSQL = _interopRequireDefault(require("./db/createSQL.js"));

var _db = require("./db/db3.js");

var _router = _interopRequireDefault(require("./router"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// CONFIG AUTH ENVIROMENT
_dotenv["default"].config(); //CREATE DATABASE SQL OR VERIFY DATABASE


(0, _createSQL["default"])(_db.client); //APP

var app = (0, _express["default"])(); // BODY PARSER MIDDLEWARE

var urlencodedParser = _bodyParser["default"].urlencoded({
  extended: false
});

var jsonParser = _bodyParser["default"].json();

app.use(urlencodedParser);
app.use(jsonParser); // GENERAL API RESPONSE HEADER 

app.use(function (req, res, next) {
  res.set(_headers.header);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
}); // MOUNT THE SUB APP

app.use('/api/v1', _router["default"]); //ERROR HANDLING

app.all('*', function (req, res) {
  res.send("NOT A VALID ENDPOINT");
}); //PORT

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("HUCKSAPP API LISTENING ON PORT ".concat(PORT));
});