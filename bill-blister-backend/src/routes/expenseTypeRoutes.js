const express = require('express');
const {
  getExpenseTypes,
  getExpenseTypeById,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
  toggleExpenseTypeStatus,
  getActiveExpenseTypes,
  getExpenseTypeStats,
} = require('../controllers/expenseTypeController');
const {
  validateExpenseType,
  validateId,
  validatePagination,
} = require('../middlewares/validation');
const { authenticateToken, authorize } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get expense types with pagination and filtering
router.get('/', validatePagination, getExpenseTypes);

// Get active expense types (for dropdowns)
router.get('/active', getActiveExpenseTypes);

// Get expense type statistics
router.get('/stats', getExpenseTypeStats);

// Get expense type by ID
router.get('/:id', validateId, getExpenseTypeById);

// Create expense type (Admin only)
router.post('/', authorize('ADMIN'), validateExpenseType, createExpenseType);

// Update expense type (Admin only)
router.put('/:id', authorize('ADMIN'), validateId, updateExpenseType);

// Toggle expense type status (Admin only)
router.patch('/:id/toggle-status', authorize('ADMIN'), validateId, toggleExpenseTypeStatus);

// Delete expense type (Admin only)
router.delete('/:id', authorize('ADMIN'), validateId, deleteExpenseType);

module.exports = router;
