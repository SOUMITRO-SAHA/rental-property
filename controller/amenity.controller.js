const db = require("../config/db");
const formidable = require("formidable");
const { config } = require("../config");
const fs = require("fs");
const path = require("path");

exports.add = async (req, res) => {
	const form = new formidable.IncomingForm();

	form.parse(req, async (err, fields, files) => {
		try {
			if (err) {
				res.status(500).json({
					success: false,
					message: "Error occurred while parsing form data",
					error: err.message,
				});
				return;
			}

			// Checking for name:
			if (!fields.name) {
				return res.status(406).json({
					success: false,
					message: "Name if not defined",
				});
			}

			if (!files.icon) {
				return res.status(406).json({
					success: false,
					message: "Not image is selected",
				});
			}

			const name = fields.name[0];
			let imagePath;
			// Taking the Imagese into an array:
			let imageArrayRespose = Promise.all(
				// Make sure the the images are an array
				Object.keys(files).map(async (fileKey, index) => {
					const element = files[fileKey];
					const data = fs.readFileSync(element[0].filepath);
					const imgExtension = element[0].mimetype.split("/")[1];

					// For now store it into the Upload files:
					const uploadFolderPath = path.join(__dirname, "../uploads/amenities");
					const imageName = `amenities-${index}.${imgExtension}`;
					imagePath = path.join(uploadFolderPath, imageName);

					// Save the image data to the specified path:
					fs.writeFileSync(imagePath, data);
				})
			);

			// Getting the Images:
			let imgArray = await imageArrayRespose;
			// If Successfully Uploaded then Store the file into the Database
			// Now, Create a new amenities:
			const amenity = await db.amenity.create({
				data: {
					name,
					icon: imagePath,
				},
			});

			if (!amenity) {
				return res.status(404).json({
					success: false,
					message:
						"An error occurred while creating an amenity. Please try again",
				});
			}

			res.status(200).json({
				success: true,
				message: "Successfully added the amenity to the database",
				amenity,
			});
		} catch (error) {
			res.status(404).json({
				success: false,
				message: "Something went wrong while creating a amenity",
				error: error.message,
			});
		}
	});
};

exports.all = async (req, res) => {
	try {
		const amenity = await db.amenity.findMany();
		if (!amenity) {
			res.status(406).json({
				success: false,
				message: "Couldn't find any amenity on the DB",
			});
		}

		res.status(200).json({
			success: true,
			message: "Successfully get all the amenities",
			amenity,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while getting amenities.",
			error: error.message,
		});
	}
};

exports.delete = async (req, res) => {
	try {
		const { amenityId } = req.body;

		// Check if propertyId and amenityId are provided
		if (!amenityId) {
			return res.status(400).json({
				success: false,
				message: "Invalid input data",
			});
		}

		// Get the property by ID
		const amenity = await db.amenity.findUnique({
			where: { id: parseInt(amenityId) },
		});

		// Check if the property exists
		if (!amenity) {
			return res.status(404).json({
				success: false,
				message: "Amenity not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Amenities deleted successfully",
			deleted: amenity,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while deleting amenity from server",
			error: error.message,
		});
	}
};
