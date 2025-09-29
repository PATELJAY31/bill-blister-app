const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { asyncHandler } = require('../middlewares/errorHandler');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register new user
const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    role = 'EMPLOYEE',
    loginName,
    password,
    head1,
    head2,
    joiningDate,
    country,
    state,
    city,
    fullAddress1,
    fullAddress2
  } = req.body;

  // Check if user already exists
  const existingUser = await prisma.employee.findFirst({
    where: {
      OR: [
        { email },
        { loginName }
      ]
    }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists',
      message: existingUser.email === email ? 'Email already registered' : 'Login name already taken'
    });
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      role,
      loginName,
      passwordHash,
      head1,
      head2,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
      country,
      state,
      city,
      fullAddress1,
      fullAddress2
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      loginName: true,
      head1: true,
      head2: true,
      joiningDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      createdAt: true
    }
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    token,
    user
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email or login name
  const user = await prisma.employee.findFirst({
    where: {
      OR: [
        { email },
        { loginName: email }
      ]
    }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  // Check if account is active
  if (user.status !== 'active') {
    return res.status(401).json({
      success: false,
      error: 'Account inactive',
      message: 'Your account has been deactivated'
    });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      message: 'Email or password is incorrect'
    });
  }

  // Generate token
  const token = generateToken(user.id);

  // Return user data (excluding password)
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    loginName: user.loginName,
    head1: user.head1,
    head2: user.head2,
    joiningDate: user.joiningDate,
    country: user.country,
    state: user.state,
    city: user.city,
    fullAddress1: user.fullAddress1,
    fullAddress2: user.fullAddress2,
    createdAt: user.createdAt
  };

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: userData
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.employee.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      loginName: true,
      head1: true,
      head2: true,
      joiningDate: true,
      leavingDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      createdAt: true,
      updatedAt: true,
      reportingManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.json({
    success: true,
    user
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    head1,
    head2,
    country,
    state,
    city,
    fullAddress1,
    fullAddress2
  } = req.body;

  const user = await prisma.employee.update({
    where: { id: req.user.id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(head1 !== undefined && { head1 }),
      ...(head2 !== undefined && { head2 }),
      ...(country && { country }),
      ...(state && { state }),
      ...(city && { city }),
      ...(fullAddress1 && { fullAddress1 }),
      ...(fullAddress2 && { fullAddress2 })
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      loginName: true,
      head1: true,
      head2: true,
      joiningDate: true,
      leavingDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      updatedAt: true
    }
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password hash
  const user = await prisma.employee.findUnique({
    where: { id: req.user.id },
    select: { passwordHash: true }
  });

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      error: 'Invalid current password'
    });
  }

  // Hash new password
  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await prisma.employee.update({
    where: { id: req.user.id },
    data: { passwordHash: newPasswordHash }
  });

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Logout (client-side token removal)
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};