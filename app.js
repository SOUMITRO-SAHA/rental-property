require("dotenv").config();
const express = require("express");
var path = require("path");
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");

const propertyRoutes = require("./routes/properties.routes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
//app.set('view engine', 'jade');
app.set("view engine", "ejs");
app.use(
	cors({
		origin: "*",
	})
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
// app.use("/property", propertyRoutes);

module.exports = app;
