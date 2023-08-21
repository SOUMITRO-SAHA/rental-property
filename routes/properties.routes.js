const express = require("express");
const router = express.Router();
const propertyController = require("../controller/properties.controller");

// ============= [Detailed Add] ============= //
// Create a new property
router.post("/add", propertyController.addProperty);

// Update a property by ID
router.patch("/:id", propertyController.editPropertyById);

// Delete a property by ID
router.delete("/:id", propertyController.deletePropertyById);

// Get a property by ID
router.get("/:id", propertyController.getPropertyById);

// Get all properties
router.get("/get/all", propertyController.getAllProperties);

// ============= [Quick Add] ============= //
router.post(
	"/quick/property-details/:userId",
	propertyController.addPropertyDetails
);
router.post("/quick/rental-details", propertyController.addRentalDetails);

module.exports = router;
