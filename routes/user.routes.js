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
  .get('/login/success', (req, res) => {
    if (req.user) {
      res.status(200).json({
        error: false,
        message: 'Successfully Logged In',
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: 'Not Authorized' });
    }
  })
  .get('/login/failed', (req, res) => {
    res.status(401).json({
      error: true,
      message: 'Log in failure',
    });
  })
  .get('/auth/google', passport.authenticate('google', ['email', 'profile']))
  .get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/login/success',
      failureRedirect: '/login/failure',
    })
  )
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
