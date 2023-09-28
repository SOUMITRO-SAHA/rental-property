const date = require('date-fns');
const db = require('../config/db');
const formidable = require('formidable');
const fs = require('fs');
const {
  propertySchema,
  propertyDetailsSchema,
  rentalDetailsSchema,
} = require('../validator/property.validation');

// Admin
exports.addProperty = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error occurred while parsing form data',
          error: err.message,
        });
        return;
      }
      const {
        userId,
        numberOfBedrooms,
        numberOfBathrooms,
        possession,
        hasBalcony,
        hasPowerBackup,
        propertyType,
        isApartment,
        buildingAge,
        floor,
        totalFloor,
        buildupArea: buildupArea,
        buildingType,
        furnishingStatus,
        expectedRent,
        expectedDeposit,
        rentNegotiable,
        maintenanceCharges,
        availableDate,
        gatedSecurity,
        ownershipType,
        flooring,
        hasParking,
        carpetArea,
        facing,
        location,
      } = fields;

      const dateTime = date.format(
        new Date(availableDate[0]),
        'yyyy-MM-dd HH:mm:ss'
      );

      if (!files.photos) {
        res.status(400).json({
          success: false,
          message:
            'No Photo is selected, So default Image will be shown in the Properties Section.',
        });
      }

      const propertyData = {
        userId: parseInt(userId),
        numberOfBedrooms: parseInt(numberOfBedrooms),
        numberOfBathrooms: parseInt(numberOfBathrooms),
        possession: possession[0],
        hasBalcony: hasBalcony === 'true',
        hasPowerBackup: hasPowerBackup === 'true',
        propertyType: propertyType[0],
        isApartment: isApartment === 'true',
        buildingAge: buildingAge[0],
        floor: floor[0],
        totalFloor: totalFloor[0],
        buildupArea: parseFloat(buildupArea),
        buildingType: buildingType[0],
        furnishingStatus: furnishingStatus[0],
        expectedRent: expectedRent[0],
        expectedDeposit: expectedDeposit[0],
        rentNegotiable: rentNegotiable === 'true',
        maintenanceCharges: parseFloat(maintenanceCharges),
        availableDate: dateTime,
        gatedSecurity: gatedSecurity === 'true',
        ownershipType: ownershipType[0],
        flooring: flooring[0],
        hasParking: hasParking === 'true',
        carpetArea: parseFloat(carpetArea),
        facing: facing[0],
        location: location[0],
      };

      // Validating the Property Data:
      const { error, value: validatePropertyData } =
        propertySchema.validate(propertyData);

      // checking for any validation errors:
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid property data',
          error: error.details.map((detail) => detail.message),
        });
      }

      // Now We have to Create Photos:
      // let imagePath;
      // if (files) {
      // 	// Create Photos:
      // 	let imageArrayRes = Promise.all(
      // 		Object.keys(files).map(async (fileKey, index) => {
      // 			const element = files[fileKey];
      // 			const filePath = element[0].filepath;
      // 			const data = fs.readFileSync(filePath);
      // 			const imgExtension = element[0].mimetype.split("/")[1];

      // 			// For now store it into the Upload files:
      // 			const uploadFolderPath = path.join(
      // 				__dirname,
      // 				"../uploads/properties"
      // 			);
      // 			const imageName = `properties-${userId}-${index}.${imgExtension}`;

      // 			imagePath = path.join(uploadFolderPath, imageName);

      // 			// Save the image data to the specified path:
      // 			fs.writeFileSync(imagePath, data);
      // 		})
      // 	);
      // }

      // Before Storing the Image to the Property store it on the Photos:
      const newProperty = await db.property.create({
        data: validatePropertyData,
      });

      console.log(newProperty);

      if (!newProperty) {
        return res.status(400).json({
          success: false,
          message: 'An error occurred while creating a new Property',
        });
      }

      res.status(201).json({
        success: true,
        message: 'The new property has been created successfully',
        property: newProperty,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong while creating a new property',
        error: error.message,
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
        message: 'Property not found',
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
      message: 'Property deleted successfully',
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
        message: 'Property not found',
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
        message: 'Something went wrong when trying to find all properties',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Successfully found all properties',
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong when trying to find all properties',
      error: error.message,
    });
  }
};

// Quick Add
exports.addPropertyDetails = async (req, res) => {
  const { userId } = req.params;
  try {
    const {
      propertyType,
      buildingType,
      buildingAge,
      floor,
      totalFloor,
      buildupArea,
      furnishingStatus,
    } = req.body;

    if (
      !(
        propertyType &&
        buildingType &&
        buildingAge &&
        floor &&
        totalFloor &&
        buildupArea &&
        furnishingStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'All the fields are required',
      });
    }

    const propertyDetails = {
      userId: parseInt(userId),
      propertyType,
      builtupArea: parseFloat(buildupArea),
      furnishingStatus,
      buildingType,
      floor,
      totalFloor,
      buildingAge,
    };

    // Validating the Property Data:
    const { error, value: validatePropertyData } =
      propertyDetailsSchema.validate(propertyDetails);

    console.log('validate', validatePropertyData);

    // checking for any validation errors:
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property details',
        error: error.details.map((detail) => detail.message),
      });
    }

    const newProperty = await db.property.create({
      data: validatePropertyData,
    });

    if (!newProperty) {
      return res.status(400).json({
        success: false,
        message: 'An error occurred while creating a new property',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully created a new property',
      newProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating a new property',
    });
  }
};

// Todo: Testing Left
exports.addRentalDetails = async (req, res) => {
  const {
    propertyId,
    expectedRent,
    expectedDeposit,
    rentNegotiable,
    maintenanceCharges,
    availableDate,
    ownershipType,
    hasParking,
    hasBalcony,
    description,
    flooring,
  } = req.body;

  try {
    // Date format:
    const dateTime = date.format(
      new Date(availableDate),
      'yyyy-MM-dd HH:mm:ss'
    );

    const rentalDetails = {
      propertyId: parseInt(propertyId),
      expectedRent,
      expectedDeposit,
      rentNegotiable,
      maintenanceCharges: parseFloat(maintenanceCharges),
      availableDate: dateTime,
      ownershipType,
      hasParking,
      hasBalcony,
      description,
      flooring,
    };

    // Validate the property Data:
    const { error, value: validatePropertyData } =
      rentalDetailsSchema.validate(rentalDetails);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rental data',
        error: error.details.map((detail) => detail.message),
      });
    }
    // checking for any validation errors:
    const updateProperty = await db.property.update({
      where: { id: rentalDetails?.propertyId },
      data: validatePropertyData,
    });

    console.log('UD', updateProperty);

    if (!updateProperty) {
      return res.status(404).json({
        success: false,
        message: `an error occurred while updating the property ${propertyId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully added the updated information to the property with id ${propertyId}`,
      updateProperty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Something went wrong while adding the rental details, with property id ${propertyId}`,
    });
  }
};
exports.addLocationDetails = async (req, res) => {};
exports.addAmenities = async (req, res) => {};
exports.addPhotos = async (req, res) => {};
exports.AdditionalInformation = async (req, res) => {};
