const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

exports.addProperty = async (req, res) => {
	try {
		const {
			numberOfBedrooms,
			datePosted,
			numberOfBathrooms,
			possession,
			hasBalcony,
			isApartment,
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
			amenities,
		} = req.body;
		const propertyData = {
			numberOfBedrooms,
			datePosted,
			numberOfBathrooms,
			possession,
			hasBalcony,
			isApartment,
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
			amenities,
		};

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
};

exports.editPropertyById = async (req, res) => {
	const propertyId = parseInt(req.params.id);

	try {
		const updatedProperty = await db.property.update({
			where: { id: propertyId },
			data: {
				// Extract updated property data from req.body
				// Example: name: req.body.name,
				// Update other property fields here
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
		console.log("Hello world!");
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