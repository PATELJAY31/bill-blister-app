const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');
const { validateEmployee, validateLogin } = require('../middlewares/validation');

const router = express.Router();

// Public routes
router.post('/signup', validateEmployee, register);
router.post('/login', validateLogin, login);

// Protected routes
router.use(authenticateToken);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/logout', logout);

module.exports = router;
