const express = require('express');
const router = express.Router();
const propertyController = require('../controller/properties.controller');
const { isLoggedIn } = require('../middlewares/auth.middleware');

// ============= [Detailed Add] ============= //
// Create a new property
router.post('/add', propertyController.addProperty);

// Update a property by ID
router
  .patch('/:id', propertyController.editPropertyById)
  .delete('/:id', propertyController.deletePropertyById)
  .get('/:id', propertyController.getPropertyById);

// Get all properties
router
  .get('/', propertyController.filterProperties)
  .get('/get/all', propertyController.getAllProperties)
  .get('/get/all/:cityName', propertyController.getPropertyByCityName);

// ============= [Quick Add] ============= //
router
  .post(
    '/quick/property-details/:userId',
    propertyController.addPropertyDetails
  )
  .post('/quick/rental-details', propertyController.addRentalDetails);

// ============= [Popular Properties] ============= //
router.get('/popular/:city', propertyController.getPopularPropertiesByLocation);

module.exports = router;
