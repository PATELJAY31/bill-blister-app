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
