require("dotenv").config();
const express = require("express");
var path = require("path");
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");
const { config } = require("./config");
const propertyRoutes = require("./routes/properties.routes");
const userRoutes = require("./routes/user.routes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
//app.set('view engine', 'jade');
app.set("view engine", "jade");
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
app.get("/", (req, res) => {
	res.send("Welcome to the Rental Property Backend!");
});
app.use("/properties", propertyRoutes);
app.use("/auth", userRoutes);

app.on("error", (err) => {
	console.log("ERROR: ", err);
	throw err;
});

app.listen(config.PORT, () => {
	console.log(`Listening on ${config.PORT}`);
});
