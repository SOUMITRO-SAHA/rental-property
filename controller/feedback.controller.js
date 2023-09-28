const db = require('../config/db');

exports.createFeedback = async (req, res) => {
  const { email, fullName, mobileNumber, message } = req.body;
  try {
    const newFeedback = await db.feedback.create({
      data: {
        fullName,
        email,
        mobileNumber,
        message,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Feedback created successfully',
      feedback: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the feedback',
      error: error.message,
    });
  }
};

exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await db.feedback.findMany();

    res.status(200).json({
      success: true,
      message: 'Successfully retrieved all feedbacks',
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching feedbacks',
      error: error.message,
    });
  }
};

exports.getFeedbackById = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await db.feedback.findUnique({
      where: { id: parseInt(id) },
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully found the feedback',
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching feedback by ID',
      error: error.message,
    });
  }
};

exports.updateFeedbackById = async (req, res) => {
  const { id } = req.params;
  const { email, fullName, mobileNumber, message } = req.body;

  try {
    const updatedFeedback = await db.feedback.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        email,
        mobileNumber,
        message,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: updatedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the feedback',
      error: error.message,
    });
  }
};

exports.deleteFeedbackById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFeedback = await db.feedback.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully',
      feedback: deletedFeedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the feedback',
      error: error.message,
    });
  }
};
