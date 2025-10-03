const express = require('express');

// Import route modules
const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const expenseTypeRoutes = require('./expenseTypeRoutes');
const allocationRoutes = require('./allocationRoutes');
const claimRoutes = require('./claimRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bill Blister API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Public endpoint for basic app data (no auth required)
router.get('/public/data', async (req, res) => {
  try {
    const { prisma } = require('../config/database');
    
    // Get basic data that doesn't require authentication
    const [expenseTypes, employees] = await Promise.all([
      prisma.expenseType.findMany({
        where: { status: true },
        select: { id: true, name: true, description: true }
      }),
      prisma.employee.findMany({
        where: { isActive: true },
        select: { id: true, firstName: true, lastName: true, email: true, role: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        expenseTypes,
        employees
      }
    });
  } catch (error) {
    console.error('Public data endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load public data'
    });
  }
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bill Blister API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      expenseTypes: '/api/expense-types',
      allocations: '/api/allocations',
      claims: '/api/claims',
    },
    documentation: 'https://github.com/your-org/bill-blister-backend#api-documentation',
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/expense-types', expenseTypeRoutes);
router.use('/allocations', allocationRoutes);
router.use('/claims', claimRoutes);

module.exports = router;
