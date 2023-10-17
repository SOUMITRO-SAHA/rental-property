const date = require('date-fns');
const db = require('../config/db');
const formidable = require('formidable');
const path = require('path');
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

      // Check if photos were uploaded
      if (!files) {
        res.status(400).json({
          success: false,
          message: 'No photos selected. Default image will be used.',
        });
        return;
      }

      // Store property data in an object
      const propertyData = {
        userId: req.user.id,
        numberOfBedrooms: parseInt(fields.numberOfBedrooms[0]),
        numberOfBathrooms: parseInt(fields.numberOfBathrooms[0]),
        possession: fields.possession[0],
        hasBalcony: fields.hasBalcony[0] === 'true',
        hasPowerBackup: fields.hasPowerBackup[0] === 'true',
        propertyType: fields.propertyType[0],
        isApartment: fields.isApartment[0] === 'true',
        buildingAge: fields.buildingAge[0],
        floor: fields.floor[0],
        totalFloor: fields.totalFloor[0],
        buildupArea: parseFloat(fields.buildupArea[0]),
        buildingType: fields.buildingType[0],
        furnishingStatus: fields.furnishingStatus[0],
        expectedRent: fields.expectedRent[0],
        expectedDeposit: fields.expectedDeposit[0],
        rentNegotiable: fields.rentNegotiable[0] === 'true',
        maintenanceCharges: parseFloat(fields.maintenanceCharges[0]),
        availableDate: fields.availableDate[0],
        gatedSecurity: fields.gatedSecurity[0] === 'true',
        ownershipType: fields.ownershipType[0],
        flooring: fields.flooring[0],
        hasParking: fields.hasParking[0] === 'true',
        carpetArea: parseFloat(fields.carpetArea[0]),
        facing: fields.facing[0],
        streetAddress: fields.streetAddress[0],
        city: fields.city[0],
        state: fields.state[0],
        postalCode: fields.postalCode[0],
        country: fields.country[0],
        description: fields.description[0],
        phone: fields.phone[0],
        otherRooms: fields.otherRooms[0],
        brokerageCharge: fields.brokerageCharge[0],
      };

      // Validate property data
      const { error, value: validatePropertyData } =
        propertySchema.validate(propertyData);

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid property data',
          error: error.details.map((detail) => detail.message),
        });
      }

      // Updating the Address:
      const { streetAddress, city, state, postalCode, country } =
        validatePropertyData;
      validatePropertyData.address = `${streetAddress}, ${city}, PIN:${postalCode}, ${state}, ${country}.`;

      // Create Property with associated Photos
      const newProperty = await db.property.create({
        data: validatePropertyData,
      });

      // Create Photos
      const imageArrayRes = Promise.all(
        files.photos.map(async (element) => {
          const uploadFolderPath = path.join(
            __dirname,
            '../uploads/properties'
          );
          const filePath = element.filepath;
          const data = fs.readFileSync(filePath);
          const imgExtension = element.mimetype.split('/')[1];

          const imageName = `property-${
            req.user.id
          }-${Date.now()}.${imgExtension}`;
          const imagePath = path.join(uploadFolderPath, imageName);
          fs.writeFileSync(imagePath, data);

          return imagePath;
        })
      );

      const createdPhotos = await imageArrayRes;

      // Associate Photos with Property
      const photos = await db.photo.createMany({
        data: createdPhotos.map((url) => ({
          url,
          propertyId: newProperty.id,
        })),
      });

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

    // Increment the 'views' count
    await db.property.update({
      where: {
        id: parseInt(propertyId),
      },
      data: {
        views: property.views + 1,
      },
    });

    // Retrieve associated photos
    const propertiesWithPhotos = await db.photo.findMany({
      where: {
        id: property.id,
      },
    });

    res.status(200).json({
      success: true,
      property: { ...property, propertiesWithPhotos },
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
    const limit = Number(req.query.limit) || 10;
    const properties = await db.property.findMany({
      take: limit,
    });

    const propertiesWithPhotos = await Promise.all(
      properties.map(async (property) => {
        const photos = await db.photo.findMany({
          where: {
            propertyId: property.id,
          },
        });

        return {
          ...property,
          photos,
        };
      })
    );

    if (!properties) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong when trying to find all properties',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully found all properties',
      propertiesWithPhotos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong when trying to find all properties',
      error: error.message,
    });
  }
};

exports.getPropertyByCityName = async (req, res) => {
  try {
    const { cityName } = req.params;
    const limit = Number(req.query.limit) || 10;

    // Query the database for properties in the specified city
    const properties = await db.property.findMany({
      where: {
        city: cityName,
      },
      take: limit,
    });

    const propertiesWithPhotos = await Promise.all(
      properties.map(async (property) => {
        const photos = await db.photo.findMany({
          where: {
            propertyId: property.id,
          },
        });

        return {
          ...property,
          photos,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: `Successfully retrieved properties in ${cityName}`,
      propertiesWithPhotos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching properties',
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

// TODO: Testing Left
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

// Views of the Property:
exports.viewProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Find the property by ID
    const property = await db.property.findUnique({
      where: {
        id: parseInt(propertyId),
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Increment the 'views' count
    await db.property.update({
      where: {
        id: parseInt(propertyId),
      },
      data: {
        views: property.views + 1,
      },
    });

    res.status(200).json({
      success: true,
      message: 'View recorded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while recording the view',
      error: error.message,
    });
  }
};

// Filters
exports.filterPropertiesByType = async (req, res) => {
  try {
    const { propertyType } = req.query.type;
    const limit = Number(req.query.limit) || 10;

    // Query the database for properties of the specified type
    const filteredProperties = await db.property.findMany({
      where: {
        propertyType: propertyType,
      },
      take: limit,
    });

    if (filteredProperties.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No properties found for type: ${propertyType}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully retrieved properties of type: ${propertyType}`,
      properties: filteredProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while filtering properties by type',
      error: error.message,
    });
  }
};

// TODO: If other filter conditions comes from the Frontend the update this
exports.filterProperties = async (req, res) => {
  try {
    const { furnish, type, city } = req.query;
    const limit = Number(req.query.limit) || 10;

    const whereClause = {};

    if (type) {
      whereClause.propertyType = type;
    }

    if (city) {
      whereClause.city = city;
    }

    if (furnish) {
      whereClause.furnishingStatus = furnish;
    }

    console.log(whereClause);

    const filteredProperties = await db.property.findMany({
      where: { ...whereClause },
      take: limit,
    });

    if (filteredProperties.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No properties found with furnishing status: ${furnishingStatus}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully retrieved all properties`,
      properties: filteredProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while filtering properties',
      error: error.message,
    });
  }
};

// Popular Properties:
exports.getPopularPropertiesByLocation = async (req, res) => {
  try {
    const { city } = req.params;
    const limit = Number(req.query.limit) || 10;

    // Define the popularity criteria (e.g., views, likes)
    const popularityCriteria = {
      views: {
        gte: 100,
      },
    };

    // Query the database for popular properties in the specified city
    const popularProperties = await db.property.findMany({
      where: {
        city,
        ...popularityCriteria,
      },
      orderBy: {
        views: 'desc',
      },
      take: limit,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved popular properties',
      properties: popularProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching popular properties',
      error: error.message,
    });
  }
};
