const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get all employees with pagination and filtering
const getEmployees = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search,
    role,
    status,
    head1,
    head2
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build where clause
  const where = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { loginName: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (role) {
    where.role = role;
  }

  if (status) {
    where.status = status;
  }

  if (head1) {
    where.head1 = head1;
  }

  if (head2) {
    where.head2 = head2;
  }

  // Get employees with pagination
  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
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
        createdAt: true,
        updatedAt: true,
        reportingManager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    }),
    prisma.employee.count({ where })
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: employees,
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

// Get employee by ID
const getEmployeeById = asyncHandler(async (req, res) => {
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
      },
      subordinates: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      },
      allocations: {
        select: {
          id: true,
          allocationDate: true,
          amount: true,
          statusEng: true,
          statusHo: true,
          expenseType: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          allocationDate: 'desc'
        },
        take: 5
      }
    }
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  res.json({
    success: true,
    data: employee
  });
});

// Create new employee
const createEmployee = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    role = 'EMPLOYEE',
    reportingManagerId,
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

  // Create employee
  const employee = await prisma.employee.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      role,
      reportingManagerId: reportingManagerId ? parseInt(reportingManagerId) : null,
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
      createdAt: true,
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

  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: employee
  });
});

// Update employee
const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    reportingManagerId,
    head1,
    head2,
    joiningDate,
    leavingDate,
    country,
    state,
    city,
    fullAddress1,
    fullAddress2,
    status
  } = req.body;

  // Check if employee exists
  const existingEmployee = await prisma.employee.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingEmployee) {
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  // Check for email/login name conflicts (excluding current employee)
  if (email || req.body.loginName) {
    const conflictUser = await prisma.employee.findFirst({
      where: {
        AND: [
          { id: { not: parseInt(id) } },
          {
            OR: [
              ...(email ? [{ email }] : []),
              ...(req.body.loginName ? [{ loginName: req.body.loginName }] : [])
            ]
          }
        ]
      }
    });

    if (conflictUser) {
      return res.status(400).json({
        success: false,
        error: 'Conflict detected',
        message: conflictUser.email === email ? 'Email already registered' : 'Login name already taken'
      });
    }
  }

  // Update employee
  const employee = await prisma.employee.update({
    where: { id: parseInt(id) },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phone !== undefined && { phone }),
      ...(role && { role }),
      ...(reportingManagerId !== undefined && { 
        reportingManagerId: reportingManagerId ? parseInt(reportingManagerId) : null 
      }),
      ...(head1 !== undefined && { head1 }),
      ...(head2 !== undefined && { head2 }),
      ...(joiningDate && { joiningDate: new Date(joiningDate) }),
      ...(leavingDate && { leavingDate: new Date(leavingDate) }),
      ...(country && { country }),
      ...(state && { state }),
      ...(city && { city }),
      ...(fullAddress1 && { fullAddress1 }),
      ...(fullAddress2 && { fullAddress2 }),
      ...(status && { status })
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

  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: employee
  });
});

// Delete employee
const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if employee exists
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(id) }
  });

  if (!employee) {
    return res.status(404).json({
      success: false,
      error: 'Employee not found'
    });
  }

  // Check if employee has subordinates
  const subordinates = await prisma.employee.findMany({
    where: { reportingManagerId: parseInt(id) }
  });

  if (subordinates.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete employee',
      message: 'Employee has subordinates. Please reassign them first.'
    });
  }

  // Delete employee
  await prisma.employee.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Employee deleted successfully'
  });
});

// Get employee statistics
const getEmployeeStats = asyncHandler(async (req, res) => {
  const [
    totalEmployees,
    activeEmployees,
    inactiveEmployees,
    employeesByRole,
    recentHires
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { status: 'active' } }),
    prisma.employee.count({ where: { status: 'inactive' } }),
    prisma.employee.groupBy({
      by: ['role'],
      _count: { role: true }
    }),
    prisma.employee.findMany({
      where: {
        joiningDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        joiningDate: true
      },
      orderBy: { joiningDate: 'desc' },
      take: 5
    })
  ]);

  res.json({
    success: true,
    data: {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      employeesByRole: employeesByRole.map(item => ({
        role: item.role,
        count: item._count.role
      })),
      recentHires
    }
  });
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
};