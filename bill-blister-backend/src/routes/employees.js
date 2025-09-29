const express = require('express');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} = require('../controllers/employeeController');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middlewares/auth');
const { validateEmployee, validateId, validatePagination } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', validatePagination, getEmployees);
router.get('/stats', getEmployeeStats);
router.get('/:id', validateId, getEmployeeById);

// Admin only routes
router.post('/', requireAdmin, validateEmployee, createEmployee);
router.put('/:id', requireAdmin, validateId, updateEmployee);
router.delete('/:id', requireAdmin, validateId, deleteEmployee);

module.exports = router;
