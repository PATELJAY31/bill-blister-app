const { prisma } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { paginate } = require('../utils/response');

// Get all expense types with pagination and filtering
const getExpenseTypes = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  const pagination = paginate(parseInt(page), parseInt(limit));

  // Build where clause
  const where = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (status !== undefined) {
    where.status = status === 'true';
  }

  // Get expense types with pagination
  const [expenseTypes, total] = await Promise.all([
    prisma.expenseType.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      ...pagination,
    }),
    prisma.expenseType.count({ where }),
  ]);

  return paginatedResponse(res, { results: expenseTypes, total }, pagination, 'Expense types retrieved successfully');
});

// Get expense type by ID
const getExpenseTypeById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          allocations: true,
          claims: true,
        },
      },
    },
  });

  if (!expenseType) {
    return errorResponse(res, 404, 'Expense type not found');
  }

  return successResponse(res, 200, 'Expense type retrieved successfully', { expenseType });
});

// Create new expense type
const createExpenseType = catchAsync(async (req, res) => {
  const { name, description, status = true } = req.body;

  // Check if expense type already exists
  const existingExpenseType = await prisma.expenseType.findUnique({
    where: { name },
  });

  if (existingExpenseType) {
    return errorResponse(res, 409, 'Expense type with this name already exists');
  }

  // Create expense type
  const expenseType = await prisma.expenseType.create({
    data: {
      name,
      description,
      status,
    },
  });

  return successResponse(res, 201, 'Expense type created successfully', { expenseType });
});

// Update expense type
const updateExpenseType = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  // Check if expense type exists
  const existingExpenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingExpenseType) {
    return errorResponse(res, 404, 'Expense type not found');
  }

  // Check if name is being changed and if it's already taken
  if (name && name !== existingExpenseType.name) {
    const nameExists = await prisma.expenseType.findUnique({
      where: { name },
    });

    if (nameExists) {
      return errorResponse(res, 409, 'Expense type with this name already exists');
    }
  }

  // Update expense type
  const expenseType = await prisma.expenseType.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
    },
  });

  return successResponse(res, 200, 'Expense type updated successfully', { expenseType });
});

// Delete expense type
const deleteExpenseType = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if expense type exists
  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          allocations: true,
          claims: true,
        },
      },
    },
  });

  if (!expenseType) {
    return errorResponse(res, 404, 'Expense type not found');
  }

  // Check if expense type is being used
  if (expenseType._count.allocations > 0 || expenseType._count.claims > 0) {
    return errorResponse(res, 409, 'Cannot delete expense type that is being used in allocations or claims');
  }

  // Delete expense type
  await prisma.expenseType.delete({
    where: { id: parseInt(id) },
  });

  return successResponse(res, 200, 'Expense type deleted successfully');
});

// Toggle expense type status
const toggleExpenseTypeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if expense type exists
  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) },
  });

  if (!expenseType) {
    return errorResponse(res, 404, 'Expense type not found');
  }

  // Toggle status
  const updatedExpenseType = await prisma.expenseType.update({
    where: { id: parseInt(id) },
    data: { status: !expenseType.status },
  });

  return successResponse(res, 200, 'Expense type status updated successfully', { expenseType: updatedExpenseType });
});

// Get active expense types (for dropdowns)
const getActiveExpenseTypes = catchAsync(async (req, res) => {
  const expenseTypes = await prisma.expenseType.findMany({
    where: { status: true },
    select: {
      id: true,
      name: true,
      description: true,
    },
    orderBy: { name: 'asc' },
  });

  return successResponse(res, 200, 'Active expense types retrieved successfully', { expenseTypes });
});

// Get expense type statistics
const getExpenseTypeStats = catchAsync(async (req, res) => {
  const [
    totalExpenseTypes,
    activeExpenseTypes,
    inactiveExpenseTypes,
    expenseTypesWithUsage,
  ] = await Promise.all([
    prisma.expenseType.count(),
    prisma.expenseType.count({ where: { status: true } }),
    prisma.expenseType.count({ where: { status: false } }),
    prisma.expenseType.findMany({
      include: {
        _count: {
          select: {
            allocations: true,
            claims: true,
          },
        },
      },
    }),
  ]);

  const stats = {
    total: totalExpenseTypes,
    active: activeExpenseTypes,
    inactive: inactiveExpenseTypes,
    usage: expenseTypesWithUsage.map(et => ({
      id: et.id,
      name: et.name,
      allocations: et._count.allocations,
      claims: et._count.claims,
    })),
  };

  return successResponse(res, 200, 'Expense type statistics retrieved successfully', { stats });
});

module.exports = {
  getExpenseTypes,
  getExpenseTypeById,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
  toggleExpenseTypeStatus,
  getActiveExpenseTypes,
  getExpenseTypeStats,
};
