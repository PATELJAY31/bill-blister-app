const express = require('express');
const {
  getExpenseTypes,
  getExpenseTypeById,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
  toggleExpenseTypeStatus,
  getExpenseTypeStats
} = require('../controllers/expenseTypeController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { validateExpenseType, validateId } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', getExpenseTypes);
router.get('/stats', getExpenseTypeStats);
router.get('/:id', validateId, getExpenseTypeById);

// Admin only routes
router.post('/', requireAdmin, validateExpenseType, createExpenseType);
router.put('/:id', requireAdmin, validateId, updateExpenseType);
router.delete('/:id', requireAdmin, validateId, deleteExpenseType);
router.patch('/:id/toggle-status', requireAdmin, validateId, toggleExpenseTypeStatus);

module.exports = router;
