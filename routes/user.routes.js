const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const { authorizedAdmin } = require('../middlewares/auth.middleware');
const passport = require('passport');
const { config } = require('../config');

// Auth routes
router.post('/auth/sign-up', userController.signUp);
router.post('/auth/log-in', userController.login);
router.get('/auth/log-out', userController.logout);

// Auth With Google and Facebook
// Google
router
  .post('/auth/google', userController.authWithGoogle)
  .get('/logout', (req, res) => {
    req.logout();
  });

// Facebook
router
  .get('/auth/facebook', passport.authenticate('facebook'))
  .get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

// Admin routes
router.get('/admin/user/:userId', userController.getUserById);
router.get('/admin/users/all', userController.getAllUsers);
router.patch(
  '/admin/user/:userId',
  authorizedAdmin,
  userController.updateUserById
);
router.patch('/admin/role/:userId', authorizedAdmin, userController.updateRole);

module.exports = router;
