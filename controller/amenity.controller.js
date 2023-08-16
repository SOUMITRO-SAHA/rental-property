const db = require("../config/db");
const { formidable } = require("formidable");
const { s3FileUpload } = require("../services/imageUpload");
const { config } = require("../config");

exports.add = async (req, res) => {
	console.log("Adding...");

	const form = formidable({
		multiples: true,
		keepExtensions: true,
	});

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

			// Let First Get the Amenity Id:

			if (!files.icon) {
				res.status(406).json({
					success: false,
					message: "Not image is selected",
				});
			}

			// Handling the Image Array:
			// Todo: AWS-SDK Calling Here:
			/*
      let imageArrayRes = Promise.all(
				Object.keys(files).map(async (fileKey, index) => {
					const element = files[fileKey];
					const data = fs.readFileSync(element.filePath);
					// Todo: Upload the Image into the Bucket:
					const uplodad = await s3FileUpload({
						bucketName: config.S3_BUCKET_NAME,
						key: `amenities/photo_${index + 1}/${Date.now()}`,
					});

					return {
						secure_url: uplodad.Location,
					};
				})
			);

      let imgArray = await imageArrayRes;
      */

			// Now, Create a new amenities:

			const amenity = await db.amenity.create({
				data: {
					name: fields.name[0],
					icon: files.icon.newFilename, // Todo Upload the secure_url link here
				},
			});
			// Rest of the code
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

exports.remove = async (req, res) => {
	try {
		const { propertyId, amenityIds } = req.body;

		// Check if propertyId and amenityIds are provided
		if (!propertyId || !amenityIds || !Array.isArray(amenityIds)) {
			return res.status(400).json({
				success: false,
				message: "Invalid input data",
			});
		}

		// Get the property by ID
		const property = await db.property.findUnique({
			where: { id: propertyId },
		});

		// Check if the property exists
		if (!property) {
			return res.status(404).json({
				success: false,
				message: "Property not found",
			});
		}

		// Disassociate the specified amenities from the property
		await db.property.update({
			where: { id: propertyId },
			data: {
				amenities: {
					disconnect: amenityIds.map((id) => ({ id })),
				},
			},
		});

		res.status(200).json({
			success: true,
			message: "Amenities removed from property successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong while removing amenities from property",
			error: error.message,
		});
	}
};
