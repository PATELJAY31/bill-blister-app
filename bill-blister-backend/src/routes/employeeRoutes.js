const express = require('express');
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
} = require('../controllers/employeeController');
const {
  validateEmployee,
  validateId,
  validatePagination,
} = require('../middlewares/validation');
const { authenticateToken, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get employees with pagination and filtering
router.get('/', validatePagination, getEmployees);

// Get employee statistics
router.get('/stats', getEmployeeStats);

// Get employee by ID
router.get('/:id', validateId, getEmployeeById);

// Create employee (Admin only)
router.post('/', authorize('ADMIN'), validateEmployee, createEmployee);

// Update employee (Admin only)
router.put('/:id', authorize('ADMIN'), validateId, updateEmployee);

// Delete employee (Admin only)
router.delete('/:id', authorize('ADMIN'), validateId, deleteEmployee);

module.exports = router;
