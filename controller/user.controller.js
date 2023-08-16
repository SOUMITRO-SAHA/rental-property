const { validationResult } = require("express-validator");
const db = require("../config/db");

exports.create = async (req, res) => {
	try {
		const errors = validationResult(req);

		// If there is error then return Error
		if (!errors.isEmpty()) {
			res.status(400).json({
				success: false,
				errors: errors.array(),
			});
		}

		const { name, email, password, role } = req.body;
		// Getting the User | Creating a new User
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while creating a new user",
			errors: error.message,
		});
	}
};
exports.login = async (req, res) => {};
exports.logout = async (req, res) => {};
exports.updateUserById = async (req, res) => {};
exports.getUserById = async (req, res) => {};
exports.getAllUsers = async (req, res) => {};
