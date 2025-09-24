const express = require('express');
const {
  getAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getAllocationStats,
} = require('../controllers/allocationController');
const {
  validateAllocation,
  validateId,
  validatePagination,
} = require('../middlewares/validation');
const { authenticateToken, authorize } = require('../middlewares/auth');
const { uploadSingle } = require('../utils/fileUpload');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get allocations with pagination and filtering
router.get('/', validatePagination, getAllocations);

// Get allocation statistics
router.get('/stats', getAllocationStats);

// Get allocation by ID
router.get('/:id', validateId, getAllocationById);

// Create allocation (Admin only)
router.post('/', authorize('ADMIN'), uploadSingle('file'), validateAllocation, createAllocation);

// Update allocation (Admin only)
router.put('/:id', authorize('ADMIN'), validateId, uploadSingle('file'), updateAllocation);

// Delete allocation (Admin only)
router.delete('/:id', authorize('ADMIN'), validateId, deleteAllocation);

module.exports = router;
