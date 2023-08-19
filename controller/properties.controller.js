const { PrismaClient } = require("@prisma/client");
const formidable = require("formidable");
const db = new PrismaClient();
const fs = require("fs");

exports.addProperty = async (req, res) => {
	console.log("Add property");

	const form = new formidable.IncomingForm();

	form.parse(req, async (err, fields, files) => {
		console.log(fields);
		try {
			if (err) {
				res.status(500).json({
					success: false,
					message: "Error occurred while parsing form data",
					error: err.message,
				});
				return;
			}
			const {
				numberOfBedrooms,
				numberOfBathrooms,
				possession,
				hasBalcony,
				isApartment,
				apartmentType,
				hasParking,
				hasPowerBackup,
				buildingAge,
				maintenanceCharges,
				builtupArea,
				furnishingStatus,
				floor,
				gatedSecurity,
				ownershipType,
				flooring,
				carpetArea,
				facing,
				location,
			} = fields;

			const propertyData = {
				numberOfBedrooms: parseInt(numberOfBedrooms),
				numberOfBathrooms: parseInt(numberOfBathrooms),
				possession: possession[0],
				hasBalcony: hasBalcony === "true", // Convert to boolean
				isApartment: isApartment === "true",
				apartmentType: apartmentType[0],
				hasParking: hasParking === "true",
				hasPowerBackup: hasPowerBackup === "true",
				buildingAge: buildingAge[0],
				maintenanceCharges: parseFloat(maintenanceCharges),
				builtupArea: parseFloat(builtupArea),
				furnishingStatus: furnishingStatus[0],
				floor: floor[0],
				gatedSecurity: gatedSecurity === "true",
				ownershipType: ownershipType[0],
				flooring: flooring[0],
				carpetArea: parseFloat(carpetArea),
				facing: facing[0],
				location: location[0],
			};

			console.log(propertyData);

			if (!files) {
				res.send(
					"No Photo is selected, So default Image will be shown in the Properties Section."
				);
			}

			// Now We have to Create Photos:
			if (files) {
				// Create Photos:
				let imageArrayRes = Promise.all(
					Object.keys(files).map(async (fileKey, index) => {
						const element = files[fileKey];
						const filePath = element[0].filepath;
						const data = fs.readFileSync(filePath);
						// Here The Data is a Binary Data: 00 99 88 ...
						// Todo: Upload the data to provided instance:
					})
				);
			}

			const newProperty = await db.property.create({
				data: propertyData,
			});

			res.status(201).json({
				success: true,
				property: newProperty,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	});
};

exports.editPropertyById = async (req, res) => {
	const propertyId = parseInt(req.params.id);
	const updatedData = req.body;

	try {
		// First Checking for existing Properties:
		const existingProperty = await db.property.findUnique({
			where: {
				id: propertyId,
			},
		});

		// Checking if the property does not exist
		if (!existingProperty) {
			res.json({
				success: false,
				message: "Property not found",
			});
		}

		const updatedProperty = await db.property.update({
			where: { id: propertyId },
			data: {
				...existingProperty,
				...updatedData,
			},
		});

		res.status(200).json({
			success: true,
			property: updatedProperty,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deletePropertyById = async (req, res) => {
	const propertyId = parseInt(req.params.id);

	try {
		await db.property.delete({
			where: { id: propertyId },
		});

		res.status(200).json({
			success: true,
			message: "Property deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getPropertyById = async (req, res) => {
	const propertyId = parseInt(req.params.id);

	try {
		const property = await db.property.findUnique({
			where: { id: propertyId },
		});

		if (!property) {
			res.status(404).json({
				success: false,
				message: "Property not found",
			});
			return;
		}

		res.status(200).json({
			success: true,
			property,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getAllProperties = async (req, res) => {
	try {
		const properties = await db.property.findMany();

		if (!properties) {
			res.status(500).json({
				success: false,
				message: "Something went wrong when trying to find all properties",
			});
			return;
		}

		res.status(200).json({
			success: true,
			properties,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Something went wrong when trying to find all properties",
			error: error.message,
		});
	}
};

// Todo: clear this part, what are the field that should be there.
exports.quickEditPropertyById = async (req, res) => {};
