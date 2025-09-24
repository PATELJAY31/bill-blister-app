const { prisma } = require('../config/database');
const { hashPassword } = require('../utils/password');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { paginate } = require('../utils/response');

// Get all employees with pagination and filtering
const getEmployees = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pagination = paginate(parseInt(page), parseInt(limit));

  // Build where clause
  const where = {};
  
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { loginName: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (role) {
    where.role = role;
  }
  
  if (status) {
    where.status = status;
  }

  // Get employees with pagination
  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
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
      orderBy: { [sortBy]: sortOrder },
      ...pagination,
    }),
    prisma.employee.count({ where }),
  ]);

  return paginatedResponse(res, { results: employees, total }, pagination, 'Employees retrieved successfully');
});

// Get employee by ID
const getEmployeeById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
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
      leavingDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      head1: true,
      head2: true,
      reportingManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      subordinates: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!employee) {
    return errorResponse(res, 404, 'Employee not found');
  }

  return successResponse(res, 200, 'Employee retrieved successfully', { employee });
});

// Create new employee
const createEmployee = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role,
    phone,
    reportingManagerId,
    dob,
    joiningDate,
    country,
    state,
    city,
    fullAddress1,
    fullAddress2,
    head1,
    head2,
  } = req.body;

  // Check if employee already exists
  const existingEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        { email },
        { loginName: email },
      ],
    },
  });

  if (existingEmployee) {
    return errorResponse(res, 409, 'Employee with this email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create employee
  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash,
      loginName: email,
      role,
      phone,
      reportingManagerId: reportingManagerId ? parseInt(reportingManagerId) : null,
      dob: dob ? new Date(dob) : null,
      joiningDate: joiningDate ? new Date(joiningDate) : null,
      country,
      state,
      city,
      fullAddress1,
      fullAddress2,
      head1,
      head2,
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
      joiningDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      head1: true,
      head2: true,
      reportingManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      createdAt: true,
    },
  });

  return successResponse(res, 201, 'Employee created successfully', { employee });
});

// Update employee
const updateEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    role,
    phone,
    reportingManagerId,
    dob,
    joiningDate,
    leavingDate,
    country,
    state,
    city,
    fullAddress1,
    fullAddress2,
    head1,
    head2,
    status,
  } = req.body;

  // Check if employee exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingEmployee) {
    return errorResponse(res, 404, 'Employee not found');
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== existingEmployee.email) {
    const emailExists = await prisma.employee.findFirst({
      where: {
        OR: [
          { email },
          { loginName: email },
        ],
        NOT: { id: parseInt(id) },
      },
    });

    if (emailExists) {
      return errorResponse(res, 409, 'Email is already taken by another employee');
    }
  }

  // Update employee
  const employee = await prisma.employee.update({
    where: { id: parseInt(id) },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { 
        email,
        loginName: email, // Update login name to match email
      }),
      ...(role && { role }),
      ...(phone !== undefined && { phone }),
      ...(reportingManagerId !== undefined && { 
        reportingManagerId: reportingManagerId ? parseInt(reportingManagerId) : null 
      }),
      ...(dob !== undefined && { dob: dob ? new Date(dob) : null }),
      ...(joiningDate !== undefined && { joiningDate: joiningDate ? new Date(joiningDate) : null }),
      ...(leavingDate !== undefined && { leavingDate: leavingDate ? new Date(leavingDate) : null }),
      ...(country !== undefined && { country }),
      ...(state !== undefined && { state }),
      ...(city !== undefined && { city }),
      ...(fullAddress1 !== undefined && { fullAddress1 }),
      ...(fullAddress2 !== undefined && { fullAddress2 }),
      ...(head1 !== undefined && { head1 }),
      ...(head2 !== undefined && { head2 }),
      ...(status && { status }),
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
      joiningDate: true,
      leavingDate: true,
      country: true,
      state: true,
      city: true,
      fullAddress1: true,
      fullAddress2: true,
      head1: true,
      head2: true,
      reportingManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      updatedAt: true,
    },
  });

  return successResponse(res, 200, 'Employee updated successfully', { employee });
});

// Delete employee (soft delete by setting status to INACTIVE)
const deleteEmployee = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if employee exists
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) },
  });

  if (!employee) {
    return errorResponse(res, 404, 'Employee not found');
  }

  // Soft delete by setting status to INACTIVE
  await prisma.employee.update({
    where: { id: parseInt(id) },
    data: { 
      status: 'INACTIVE',
      leavingDate: new Date(),
    },
  });

  return successResponse(res, 200, 'Employee deactivated successfully');
});

// Get employee statistics
const getEmployeeStats = catchAsync(async (req, res) => {
  const [
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    employeesByRole,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    prisma.employee.count({ where: { status: 'INACTIVE' } }),
    prisma.employee.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
  ]);

  const stats = {
    total: totalEmployees,
    active: activeEmployees,
    inactive: inactiveEmployees,
    byRole: employeesByRole.reduce((acc, item) => {
      acc[item.role] = item._count.role;
      return acc;
    }, {}),
  };

  return successResponse(res, 200, 'Employee statistics retrieved successfully', { stats });
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
};
