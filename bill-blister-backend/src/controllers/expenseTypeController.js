const { prisma } = require('../config/database');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get all expense types
const getExpenseTypes = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const where = {};

  if (status !== undefined) {
    where.status = status === 'true';
  }

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive'
    };
  }

  const expenseTypes = await prisma.expenseType.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          allocations: true
        }
      }
    }
  });

  res.json({
    success: true,
    data: expenseTypes
  });
});

// Get expense type by ID
const getExpenseTypeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          allocations: true
        }
      },
      allocations: {
        select: {
          id: true,
          allocationDate: true,
          amount: true,
          statusEng: true,
          statusHo: true,
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          allocationDate: 'desc'
        },
        take: 10
      }
    }
  });

  if (!expenseType) {
    return res.status(404).json({
      success: false,
      error: 'Expense type not found'
    });
  }

  res.json({
    success: true,
    data: expenseType
  });
});

// Create new expense type
const createExpenseType = asyncHandler(async (req, res) => {
  const { name, status = true } = req.body;

  // Check if expense type already exists
  const existingExpenseType = await prisma.expenseType.findUnique({
    where: { name }
  });

  if (existingExpenseType) {
    return res.status(400).json({
      success: false,
      error: 'Expense type already exists',
      message: 'An expense type with this name already exists'
    });
  }

  const expenseType = await prisma.expenseType.create({
    data: {
      name,
      status
    }
  });

  res.status(201).json({
    success: true,
    message: 'Expense type created successfully',
    data: expenseType
  });
});

// Update expense type
const updateExpenseType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  // Check if expense type exists
  const existingExpenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingExpenseType) {
    return res.status(404).json({
      success: false,
      error: 'Expense type not found'
    });
  }

  // Check for name conflict (excluding current expense type)
  if (name && name !== existingExpenseType.name) {
    const conflictExpenseType = await prisma.expenseType.findUnique({
      where: { name }
    });

    if (conflictExpenseType) {
      return res.status(400).json({
        success: false,
        error: 'Expense type already exists',
        message: 'An expense type with this name already exists'
      });
    }
  }

  const expenseType = await prisma.expenseType.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(status !== undefined && { status })
    }
  });

  res.json({
    success: true,
    message: 'Expense type updated successfully',
    data: expenseType
  });
});

// Delete expense type
const deleteExpenseType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if expense type exists
  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          allocations: true
        }
      }
    }
  });

  if (!expenseType) {
    return res.status(404).json({
      success: false,
      error: 'Expense type not found'
    });
  }

  // Check if expense type has allocations
  if (expenseType._count.allocations > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete expense type',
      message: 'Expense type has allocations. Please reassign or delete them first.'
    });
  }

  await prisma.expenseType.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Expense type deleted successfully'
  });
});

// Toggle expense type status
const toggleExpenseTypeStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(id) }
  });

  if (!expenseType) {
    return res.status(404).json({
      success: false,
      error: 'Expense type not found'
    });
  }

  const updatedExpenseType = await prisma.expenseType.update({
    where: { id: parseInt(id) },
    data: {
      status: !expenseType.status
    }
  });

  res.json({
    success: true,
    message: `Expense type ${updatedExpenseType.status ? 'activated' : 'deactivated'} successfully`,
    data: updatedExpenseType
  });
});

// Get expense type statistics
const getExpenseTypeStats = asyncHandler(async (req, res) => {
  const [
    totalExpenseTypes,
    activeExpenseTypes,
    inactiveExpenseTypes,
    expenseTypesWithAllocations
  ] = await Promise.all([
    prisma.expenseType.count(),
    prisma.expenseType.count({ where: { status: true } }),
    prisma.expenseType.count({ where: { status: false } }),
    prisma.expenseType.findMany({
      where: {
        status: true,
        allocations: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            allocations: true
          }
        }
      },
      orderBy: {
        allocations: {
          _count: 'desc'
        }
      }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalExpenseTypes,
      activeExpenseTypes,
      inactiveExpenseTypes,
      expenseTypesWithAllocations
    }
  });
});

module.exports = {
  getExpenseTypes,
  getExpenseTypeById,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
  toggleExpenseTypeStatus,
  getExpenseTypeStats
};