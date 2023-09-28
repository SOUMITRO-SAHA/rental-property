const express = require('express');
const router = express.Router();
const generalController = require('../controller/general.controller');

router
  .get('/all', generalController.getBanner)
  .post('/create', generalController.addBanner)
  .patch('/:id', generalController.updateBanner);

module.exports = router;
