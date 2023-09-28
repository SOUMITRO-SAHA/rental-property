const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/feedback.controller');
const { isLoggedIn } = require('../middlewares/auth.middleware');

// Create Feedback
router.post('/create', isLoggedIn, feedbackController.createFeedback);

// Get All Feedbacks
router.get('/all', isLoggedIn, feedbackController.getAllFeedbacks);

// Get Feedback by ID
router
  .get('/:id', feedbackController.getFeedbackById)
  .patch('/:id', isLoggedIn, feedbackController.updateFeedbackById)
  .delete('/:id', feedbackController.deleteFeedbackById);

module.exports = router;
