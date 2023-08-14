const app = require("./app");
const { config } = require("./config");

app.on("error", (err) => {
	console.log("ERROR: ", err);
	throw err;
});

app.listen(config.PORT, () => {
	console.log(`Listening on ${config.PORT}`);
});
