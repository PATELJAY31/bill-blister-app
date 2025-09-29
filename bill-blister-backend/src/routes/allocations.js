const express = require('express');
const {
  getAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  verifyAllocation,
  approveAllocation,
  getAllocationStats
} = require('../controllers/allocationController');
const { authenticateToken, requireEngineer, requireApprover } = require('../middlewares/auth');
const { validateAllocation, validateId, validatePagination, validateApproval } = require('../middlewares/validation');
const { upload } = require('../config/firebase');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/', validatePagination, getAllocations);
router.get('/stats', getAllocationStats);
router.get('/:id', validateId, getAllocationById);

// Employee routes (can create and update their own allocations)
router.post('/', upload.single('file'), validateAllocation, createAllocation);
router.put('/:id', upload.single('file'), validateId, updateAllocation);
router.delete('/:id', validateId, deleteAllocation);

// Engineer routes (verification)
router.put('/:id/verify', requireEngineer, validateId, validateApproval, verifyAllocation);

// HO/Approver routes (approval)
router.put('/:id/approve', requireApprover, validateId, validateApproval, approveAllocation);

module.exports = router;
