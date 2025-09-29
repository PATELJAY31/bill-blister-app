const express = require('express');
const {
  getHead1List,
  getHead1ById,
  createHead1,
  updateHead1,
  deleteHead1,
  toggleHead1Status,
  getHead2List,
  getHead2ById,
  createHead2,
  updateHead2,
  deleteHead2,
  toggleHead2Status,
  getHeadStats
} = require('../controllers/headController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { validateHead, validateId } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Public routes (authenticated users)
router.get('/stats', getHeadStats);

// Head1 routes
router.get('/head1', getHead1List);
router.get('/head1/:id', validateId, getHead1ById);

// Head2 routes
router.get('/head2', getHead2List);
router.get('/head2/:id', validateId, getHead2ById);

// Admin only routes for Head1
router.post('/head1', requireAdmin, validateHead, createHead1);
router.put('/head1/:id', requireAdmin, validateId, updateHead1);
router.delete('/head1/:id', requireAdmin, validateId, deleteHead1);
router.patch('/head1/:id/toggle-status', requireAdmin, validateId, toggleHead1Status);

// Admin only routes for Head2
router.post('/head2', requireAdmin, validateHead, createHead2);
router.put('/head2/:id', requireAdmin, validateId, updateHead2);
router.delete('/head2/:id', requireAdmin, validateId, deleteHead2);
router.patch('/head2/:id/toggle-status', requireAdmin, validateId, toggleHead2Status);

module.exports = router;
