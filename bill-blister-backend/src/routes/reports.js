const express = require('express');
const {
  getAllocationReports,
  getClaimReports,
  getEmployeeReports,
  getExpenseTypeReports,
  getDashboardStats
} = require('../controllers/reportController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Report routes
router.get('/allocations', getAllocationReports);
router.get('/claims', getClaimReports);
router.get('/employees', getEmployeeReports);
router.get('/expense-types', getExpenseTypeReports);
router.get('/dashboard', getDashboardStats);

module.exports = router;
