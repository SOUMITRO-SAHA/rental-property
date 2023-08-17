require("dotenv").config();
const express = require("express");
var path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { config } = require("./config");
const propertyRoutes = require("./routes/properties.routes");
const userRoutes = require("./routes/user.routes");
const amenityRoutes = require("./routes/amenity.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const ticketRoutes = require("./routes/ticket.routes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
//app.set('view engine', 'jade');
app.set("view engine", "jade");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
	})
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "views")));
//morgan logger
app.use(morgan("tiny"));

app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to the Rental Property Backend!");
});
app.use("/properties", propertyRoutes);
app.use("/amenity", amenityRoutes);
app.use(userRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/ticket", ticketRoutes);

app.on("error", (err) => {
	console.log("ERROR: ", err);
	throw err;
});

app.listen(config.PORT, () => {
	console.log(`Listening on ${config.PORT}`);
});
