const { prisma } = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateTokenPair } = require('../utils/jwt');
const { successResponse, errorResponse, badRequestResponse } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');

// Register new user
const signup = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = 'EMPLOYEE',
    phone,
    reportingManagerId,
  } = req.body;

  // Check if user already exists
  const existingUser = await prisma.employee.findFirst({
    where: {
      OR: [
        { email },
        { loginName: email },
      ],
    },
  });

  if (existingUser) {
    return badRequestResponse(res, 'User with this email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      loginName: email,
      role,
      phone,
      reportingManagerId: reportingManagerId ? parseInt(reportingManagerId) : null,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      phone: true,
      status: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const tokens = generateTokenPair(user);

  return successResponse(res, 201, 'User registered successfully', {
    user,
    ...tokens,
  });
});

// Login user
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email or login name
  const user = await prisma.employee.findFirst({
    where: {
      OR: [
        { email },
        { loginName: email },
      ],
    },
  });

  if (!user) {
    return badRequestResponse(res, 'Invalid email or password');
  }

  // Check if user is active
  if (user.status !== 'ACTIVE') {
    return badRequestResponse(res, 'Account is inactive');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    return badRequestResponse(res, 'Invalid email or password');
  }

  // Generate tokens
  const tokens = generateTokenPair(user);

  // Remove password hash from response
  const { passwordHash, ...userWithoutPassword } = user;

  return successResponse(res, 200, 'Login successful', {
    user: userWithoutPassword,
    ...tokens,
  });
});

// Get current user profile
const getProfile = catchAsync(async (req, res) => {
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
      dob: true,
      joiningDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      reportingManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      subordinates: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'Profile retrieved successfully', { user });
});

// Update user profile
const updateProfile = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    dob,
    country,
    state,
    city,
    fullAddress1,
    fullAddress2,
  } = req.body;

  const user = await prisma.employee.update({
    where: { id: req.user.id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
      ...(dob && { dob: new Date(dob) }),
      ...(country && { country }),
      ...(state && { state }),
      ...(city && { city }),
      ...(fullAddress1 && { fullAddress1 }),
      ...(fullAddress2 && { fullAddress2 }),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      dob: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      updatedAt: true,
    },
  });

  return successResponse(res, 200, 'Profile updated successfully', { user });
});

// Change password
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password hash
  const user = await prisma.employee.findUnique({
    where: { id: req.user.id },
    select: { passwordHash: true },
  });

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);

  if (!isCurrentPasswordValid) {
    return badRequestResponse(res, 'Current password is incorrect');
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await prisma.employee.update({
    where: { id: req.user.id },
    data: { passwordHash: newPasswordHash },
  });

  return successResponse(res, 200, 'Password changed successfully');
});

// Logout (client-side token removal)
const logout = catchAsync(async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // You could implement a token blacklist here if needed
  return successResponse(res, 200, 'Logged out successfully');
});

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
};
