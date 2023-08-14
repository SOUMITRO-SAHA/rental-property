const express = require("express");
const router = express.Router();
const propertyController = require("../controller/properties.controller");

// Create a new property
router.post("/add", propertyController.addProperty);

// Update a property by ID
router.put("/:id", propertyController.editPropertyById);

// Delete a property by ID
router.delete("/:id", propertyController.deletePropertyById);

// Get a property by ID
router.get("/:id", propertyController.getPropertyById);

// Get all properties
router.get("/all", propertyController.getAllProperties);

module.exports = router;
