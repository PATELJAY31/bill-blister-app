const { prisma } = require('../config/database');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get user notifications
const getNotifications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    isRead,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {
    userId: req.user.id
  };

  if (isRead !== undefined) {
    where.isRead = isRead === 'true';
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder }
    }),
    prisma.notification.count({ where })
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: notifications,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      itemsPerPage: parseInt(limit),
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1
    }
  });
});

// Get notification by ID
const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id: parseInt(id),
      userId: req.user.id
    }
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found'
    });
  }

  res.json({
    success: true,
    data: notification
  });
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id: parseInt(id),
      userId: req.user.id
    }
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found'
    });
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: parseInt(id) },
    data: { isRead: true }
  });

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: updatedNotification
  });
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res) => {
  const updatedCount = await prisma.notification.updateMany({
    where: {
      userId: req.user.id,
      isRead: false
    },
    data: { isRead: true }
  });

  res.json({
    success: true,
    message: `${updatedCount.count} notifications marked as read`
  });
});

// Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id: parseInt(id),
      userId: req.user.id
    }
  });

  if (!notification) {
    return res.status(404).json({
      success: false,
      error: 'Notification not found'
    });
  }

  await prisma.notification.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
});

// Delete all notifications
const deleteAllNotifications = asyncHandler(async (req, res) => {
  const deletedCount = await prisma.notification.deleteMany({
    where: {
      userId: req.user.id
    }
  });

  res.json({
    success: true,
    message: `${deletedCount.count} notifications deleted`
  });
});

// Get notification statistics
const getNotificationStats = asyncHandler(async (req, res) => {
  const [
    totalNotifications,
    unreadNotifications,
    readNotifications,
    recentNotifications
  ] = await Promise.all([
    prisma.notification.count({
      where: { userId: req.user.id }
    }),
    prisma.notification.count({
      where: { 
        userId: req.user.id,
        isRead: false 
      }
    }),
    prisma.notification.count({
      where: { 
        userId: req.user.id,
        isRead: true 
      }
    }),
    prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  res.json({
    success: true,
    data: {
      total: totalNotifications,
      unread: unreadNotifications,
      read: readNotifications,
      recent: recentNotifications
    }
  });
});

// Create notification (admin only)
const createNotification = asyncHandler(async (req, res) => {
  const { userId, message } = req.body;

  // Verify user exists
  const user = await prisma.employee.findUnique({
    where: { id: parseInt(userId) }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      error: 'User not found'
    });
  }

  const notification = await prisma.notification.create({
    data: {
      userId: parseInt(userId),
      message
    }
  });

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification
  });
});

// Bulk create notifications
const createBulkNotifications = asyncHandler(async (req, res) => {
  const { userIds, message } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'User IDs array is required'
    });
  }

  // Verify all users exist
  const users = await prisma.employee.findMany({
    where: {
      id: { in: userIds.map(id => parseInt(id)) }
    },
    select: { id: true }
  });

  if (users.length !== userIds.length) {
    return res.status(400).json({
      success: false,
      error: 'Some users not found'
    });
  }

  // Create notifications
  const notifications = await prisma.notification.createMany({
    data: userIds.map(userId => ({
      userId: parseInt(userId),
      message
    }))
  });

  res.status(201).json({
    success: true,
    message: `${notifications.count} notifications created successfully`
  });
});

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats,
  createNotification,
  createBulkNotifications
};
