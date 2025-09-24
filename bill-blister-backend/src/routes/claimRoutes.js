const express = require('express');
const {
  getClaims,
  getClaimById,
  createClaim,
  verifyClaim,
  approveClaim,
  updateClaim,
  deleteClaim,
  getClaimStats,
} = require('../controllers/claimController');
const {
  validateClaim,
  validateClaimVerification,
  validateId,
  validatePagination,
} = require('../middlewares/validation');
const { authenticateToken, authorize, authorizeResource } = require('../middlewares/auth');
const { uploadSingle } = require('../utils/fileUpload');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get claims with pagination and filtering
router.get('/', validatePagination, getClaims);

// Get claim statistics
router.get('/stats', getClaimStats);

// Get claim by ID
router.get('/:id', validateId, getClaimById);

// Create claim (Employees can create their own claims)
router.post('/', uploadSingle('file'), validateClaim, createClaim);

// Verify claim (Engineer role)
router.put('/:id/verify', authorize('ENGINEER', 'ADMIN'), validateId, validateClaimVerification, verifyClaim);

// Approve claim (HO Approver role)
router.put('/:id/approve', authorize('HO_APPROVER', 'ADMIN'), validateId, validateClaimVerification, approveClaim);

// Update claim (Only pending claims or owner)
router.put('/:id', validateId, authorizeResource('employeeId'), uploadSingle('file'), updateClaim);

// Delete claim (Only pending claims or owner)
router.delete('/:id', validateId, authorizeResource('employeeId'), deleteClaim);

module.exports = router;
