const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.employee.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        loginName: true,
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ 
        success: false, 
        error: 'Account is inactive' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
};

// Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Check if user is admin
const requireAdmin = requireRole('ADMIN');

// Check if user is admin or approver
const requireApprover = requireRole('ADMIN', 'APPROVER');

// Check if user is admin, approver, or engineer
const requireEngineer = requireRole('ADMIN', 'APPROVER', 'ENGINEER');

// Check if user can access their own data or is admin
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
  }

  const resourceUserId = parseInt(req.params.id || req.params.userId);
  
  if (req.user.role === 'ADMIN' || req.user.id === resourceUserId) {
    return next();
  }

  return res.status(403).json({ 
    success: false, 
    error: 'Access denied' 
  });
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireApprover,
  requireEngineer,
  requireOwnershipOrAdmin,
};