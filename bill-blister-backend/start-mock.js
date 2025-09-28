const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Mock data
const mockUsers = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@billblister.com',
    role: 'ADMIN',
    phone: '+1-555-0100',
    status: 'ACTIVE',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    email: 'employee@billblister.com',
    role: 'EMPLOYEE',
    phone: '+1-555-0101',
    status: 'ACTIVE',
  },
  {
    id: 3,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'engineer@billblister.com',
    role: 'ENGINEER',
    phone: '+1-555-0102',
    status: 'ACTIVE',
  },
  {
    id: 4,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'approver@billblister.com',
    role: 'HO_APPROVER',
    phone: '+1-555-0103',
    status: 'ACTIVE',
  },
];

// Mock JWT tokens
const generateMockToken = (user) => {
  return `mock-token-${user.id}-${Date.now()}`;
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bill Blister API is running (Mock Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || password !== 'password123') {
    return res.status(400).json({
      success: false,
      message: 'Invalid email or password',
    });
  }
  
  const accessToken = generateMockToken(user);
  const refreshToken = generateMockToken(user);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { firstName, lastName, email, password, role, phone, reportingManagerId } = req.body;
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
    });
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    firstName,
    lastName,
    email,
    role: role || 'EMPLOYEE',
    phone: phone || '',
    status: 'ACTIVE',
  };
  
  // Add to mock users array
  mockUsers.push(newUser);
  
  const accessToken = generateMockToken(newUser);
  const refreshToken = generateMockToken(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser,
      accessToken,
      refreshToken,
    },
  });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token || !token.startsWith('mock-token')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }
  
  // Extract user ID from token
  const userId = parseInt(token.split('-')[2]);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
  
  res.json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { user },
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Mock other endpoints
app.get('/api/employees', (req, res) => {
  res.json({
    success: true,
    data: mockUsers,
  });
});

app.get('/api/expense-types', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Travel', description: 'Travel expenses', status: true },
      { id: 2, name: 'Meals', description: 'Meal expenses', status: true },
      { id: 3, name: 'Office Supplies', description: 'Office supply expenses', status: true },
    ],
  });
});

app.get('/api/allocations', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

app.get('/api/claims', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on port ${PORT}`);
  console.log(`📊 Environment: Mock Mode (No Database)`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log(`📚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`\n🔑 Demo Credentials:`);
  console.log(`Admin: admin@billblister.com / password123`);
  console.log(`Employee: employee@billblister.com / password123`);
  console.log(`Engineer: engineer@billblister.com / password123`);
  console.log(`HO Approver: approver@billblister.com / password123`);
});
