const express = require('express');
const {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats,
  createNotification,
  createBulkNotifications
} = require('../controllers/notificationController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { validateId, validatePagination } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User routes
router.get('/', validatePagination, getNotifications);
router.get('/stats', getNotificationStats);
router.get('/:id', validateId, getNotificationById);
router.put('/:id/read', validateId, markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', validateId, deleteNotification);
router.delete('/', deleteAllNotifications);

// Admin only routes
router.post('/', requireAdmin, createNotification);
router.post('/bulk', requireAdmin, createBulkNotifications);

module.exports = router;
