const express = require('express');
const {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} = require('../controllers/authController');
const {
  validateSignup,
  validateLogin,
} = require('../middlewares/validation');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

// Protected routes
router.use(authenticateToken); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;
