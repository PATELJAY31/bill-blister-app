const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Initialize Express app
const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Mock data
const mockEmployees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@billblister.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'employee@billblister.com',
    role: 'EMPLOYEE',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'engineer@billblister.com',
    role: 'ENGINEER',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'approver@billblister.com',
    role: 'HO_APPROVER',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockExpenseTypes = [
  { id: 1, name: 'Food', description: 'Meals and food expenses', status: true },
  { id: 2, name: 'Travel', description: 'Transportation and travel expenses', status: true },
  { id: 3, name: 'Office Supplies', description: 'Office materials and supplies', status: true },
  { id: 4, name: 'Conference', description: 'Conference and training expenses', status: true },
];

const mockAllocations = [
  {
    id: 1,
    allocationDate: '2024-01-15',
    employeeId: 2,
    expenseTypeId: 1,
    amount: 1000.00,
    remarks: 'Monthly food allowance',
    status: 'ACTIVE',
    employee: mockEmployees[1],
    expenseType: mockExpenseTypes[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    allocationDate: '2024-01-15',
    employeeId: 2,
    expenseTypeId: 2,
    amount: 2000.00,
    remarks: 'Travel budget',
    status: 'ACTIVE',
    employee: mockEmployees[1],
    expenseType: mockExpenseTypes[1],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockClaims = [
  {
    id: 1,
    employeeId: 2,
    expenseTypeId: 1,
    amount: 150.00,
    description: 'Lunch with client',
    billDate: '2024-01-20',
    status: 'PENDING',
    employee: mockEmployees[1],
    expenseType: mockExpenseTypes[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bill Blister API Server is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login',
      employees: '/api/employees',
      expenseTypes: '/api/expense-types',
      allocations: '/api/allocations',
      claims: '/api/claims'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bill Blister API is running',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockEmployees.find(emp => emp.email === email);
  
  if (!user || password !== 'password123') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Mock JWT token
  const token = 'mock-jwt-token-' + Date.now();
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }
  });
});

// Employee endpoints
app.get('/api/employees', (req, res) => {
  res.json(mockEmployees);
});

// Expense type endpoints
app.get('/api/expense-types', (req, res) => {
  res.json(mockExpenseTypes);
});

// Allocation endpoints
app.get('/api/allocations', (req, res) => {
  res.json(mockAllocations);
});

app.post('/api/allocations', (req, res) => {
  const newAllocation = {
    id: mockAllocations.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockAllocations.push(newAllocation);
  res.json(newAllocation);
});

// Claim endpoints
app.get('/api/claims', (req, res) => {
  res.json(mockClaims);
});

app.post('/api/claims', (req, res) => {
  const newClaim = {
    id: mockClaims.length + 1,
    ...req.body,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockClaims.push(newClaim);
  res.json(newClaim);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Bill Blister Mock API Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log('\n🔑 Demo Credentials:');
  console.log('Admin: admin@billblister.com / password123');
  console.log('Employee: employee@billblister.com / password123');
  console.log('Engineer: engineer@billblister.com / password123');
  console.log('HO Approver: approver@billblister.com / password123');
});