const { prisma } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { paginate } = require('../utils/response');
const { uploadFile, generateFilePath } = require('../utils/fileUpload');
const { initializeFirebase } = require('../config/firebase');

// Initialize Firebase
initializeFirebase();

// Get all allocations with pagination and filtering
const getAllocations = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    employeeId,
    expenseTypeId,
    status,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pagination = paginate(parseInt(page), parseInt(limit));

  // Build where clause
  const where = {};
  
  if (search) {
    where.OR = [
      { remarks: { contains: search, mode: 'insensitive' } },
      { billNumber: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
      { employee: {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }},
    ];
  }
  
  if (employeeId) {
    where.employeeId = parseInt(employeeId);
  }
  
  if (expenseTypeId) {
    where.expenseTypeId = parseInt(expenseTypeId);
  }
  
  if (status) {
    where.status = status;
  }
  
  if (startDate || endDate) {
    where.allocationDate = {};
    if (startDate) {
      where.allocationDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.allocationDate.lte = new Date(endDate);
    }
  }

  // Get allocations with pagination
  const [allocations, total] = await Promise.all([
    prisma.allocation.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        expenseType: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      ...pagination,
    }),
    prisma.allocation.count({ where }),
  ]);

  return paginatedResponse(res, { results: allocations, total }, pagination, 'Allocations retrieved successfully');
});

// Get allocation by ID
const getAllocationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const allocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          phone: true,
        },
      },
      expenseType: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      claims: {
        select: {
          id: true,
          amount: true,
          description: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!allocation) {
    return errorResponse(res, 404, 'Allocation not found');
  }

  return successResponse(res, 200, 'Allocation retrieved successfully', { allocation });
});

// Create new allocation
const createAllocation = catchAsync(async (req, res) => {
  const {
    allocationDate,
    employeeId,
    expenseTypeId,
    amount,
    remarks,
    billNumber,
    billDate,
    notes,
  } = req.body;

  // Verify employee exists
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(employeeId) },
    select: { id: true, status: true },
  });

  if (!employee) {
    return errorResponse(res, 404, 'Employee not found');
  }

  if (employee.status !== 'ACTIVE') {
    return errorResponse(res, 400, 'Cannot create allocation for inactive employee');
  }

  // Verify expense type exists
  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(expenseTypeId) },
    select: { id: true, status: true },
  });

  if (!expenseType) {
    return errorResponse(res, 404, 'Expense type not found');
  }

  if (!expenseType.status) {
    return errorResponse(res, 400, 'Cannot create allocation for inactive expense type');
  }

  // Handle file upload if present
  let fileUrl = null;
  if (req.file) {
    try {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const filePath = generateFilePath('allocations', fileName);
      fileUrl = await uploadFile(req.file, filePath);
    } catch (error) {
      console.error('File upload error:', error);
      return errorResponse(res, 500, 'File upload failed');
    }
  }

  // Create allocation
  const allocation = await prisma.allocation.create({
    data: {
      allocationDate: new Date(allocationDate),
      employeeId: parseInt(employeeId),
      expenseTypeId: parseInt(expenseTypeId),
      amount: parseFloat(amount),
      remarks,
      billNumber,
      billDate: billDate ? new Date(billDate) : null,
      fileUrl,
      notes,
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      expenseType: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  return successResponse(res, 201, 'Allocation created successfully', { allocation });
});

// Update allocation
const updateAllocation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    allocationDate,
    employeeId,
    expenseTypeId,
    amount,
    remarks,
    billNumber,
    billDate,
    notes,
    status,
  } = req.body;

  // Check if allocation exists
  const existingAllocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingAllocation) {
    return errorResponse(res, 404, 'Allocation not found');
  }

  // Verify employee exists if being changed
  if (employeeId && employeeId !== existingAllocation.employeeId) {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      select: { id: true, status: true },
    });

    if (!employee) {
      return errorResponse(res, 404, 'Employee not found');
    }

    if (employee.status !== 'ACTIVE') {
      return errorResponse(res, 400, 'Cannot assign allocation to inactive employee');
    }
  }

  // Verify expense type exists if being changed
  if (expenseTypeId && expenseTypeId !== existingAllocation.expenseTypeId) {
    const expenseType = await prisma.expenseType.findUnique({
      where: { id: parseInt(expenseTypeId) },
      select: { id: true, status: true },
    });

    if (!expenseType) {
      return errorResponse(res, 404, 'Expense type not found');
    }

    if (!expenseType.status) {
      return errorResponse(res, 400, 'Cannot assign allocation to inactive expense type');
    }
  }

  // Handle file upload if present
  let fileUrl = existingAllocation.fileUrl;
  if (req.file) {
    try {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const filePath = generateFilePath('allocations', fileName);
      fileUrl = await uploadFile(req.file, filePath);
    } catch (error) {
      console.error('File upload error:', error);
      return errorResponse(res, 500, 'File upload failed');
    }
  }

  // Update allocation
  const allocation = await prisma.allocation.update({
    where: { id: parseInt(id) },
    data: {
      ...(allocationDate && { allocationDate: new Date(allocationDate) }),
      ...(employeeId && { employeeId: parseInt(employeeId) }),
      ...(expenseTypeId && { expenseTypeId: parseInt(expenseTypeId) }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(remarks !== undefined && { remarks }),
      ...(billNumber !== undefined && { billNumber }),
      ...(billDate !== undefined && { billDate: billDate ? new Date(billDate) : null }),
      ...(notes !== undefined && { notes }),
      ...(status && { status }),
      ...(fileUrl && { fileUrl }),
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      expenseType: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  return successResponse(res, 200, 'Allocation updated successfully', { allocation });
});

// Delete allocation
const deleteAllocation = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if allocation exists
  const allocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          claims: true,
        },
      },
    },
  });

  if (!allocation) {
    return errorResponse(res, 404, 'Allocation not found');
  }

  // Check if allocation has associated claims
  if (allocation._count.claims > 0) {
    return errorResponse(res, 409, 'Cannot delete allocation that has associated claims');
  }

  // Delete allocation
  await prisma.allocation.delete({
    where: { id: parseInt(id) },
  });

  return successResponse(res, 200, 'Allocation deleted successfully');
});

// Get allocation statistics
const getAllocationStats = catchAsync(async (req, res) => {
  const {
    employeeId,
    expenseTypeId,
    startDate,
    endDate,
  } = req.query;

  // Build where clause
  const where = {};
  
  if (employeeId) {
    where.employeeId = parseInt(employeeId);
  }
  
  if (expenseTypeId) {
    where.expenseTypeId = parseInt(expenseTypeId);
  }
  
  if (startDate || endDate) {
    where.allocationDate = {};
    if (startDate) {
      where.allocationDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.allocationDate.lte = new Date(endDate);
    }
  }

  const [
    totalAllocations,
    totalAmount,
    allocationsByStatus,
    allocationsByEmployee,
    allocationsByExpenseType,
  ] = await Promise.all([
    prisma.allocation.count({ where }),
    prisma.allocation.aggregate({
      where,
      _sum: { amount: true },
    }),
    prisma.allocation.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
      _sum: { amount: true },
    }),
    prisma.allocation.groupBy({
      by: ['employeeId'],
      where,
      _count: { employeeId: true },
      _sum: { amount: true },
    }),
    prisma.allocation.groupBy({
      by: ['expenseTypeId'],
      where,
      _count: { expenseTypeId: true },
      _sum: { amount: true },
    }),
  ]);

  const stats = {
    total: totalAllocations,
    totalAmount: totalAmount._sum.amount || 0,
    byStatus: allocationsByStatus.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count.employeeId,
        amount: item._sum.amount || 0,
      };
      return acc;
    }, {}),
    byEmployee: allocationsByEmployee.length,
    byExpenseType: allocationsByExpenseType.length,
  };

  return successResponse(res, 200, 'Allocation statistics retrieved successfully', { stats });
});

module.exports = {
  getAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  getAllocationStats,
};
