// Creating a Cookie:
exports.AuthOptions = {
	expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	httpOnly: true,
};
