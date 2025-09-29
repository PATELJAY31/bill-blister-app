const { prisma } = require('../config/database');
const { uploadFile } = require('../config/firebase');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get all allocations with pagination and filtering
const getAllocations = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'allocationDate',
    sortOrder = 'desc',
    search,
    empId,
    expenseTypeId,
    statusEng,
    statusHo,
    startDate,
    endDate,
    minAmount,
    maxAmount
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

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
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }},
      { expenseType: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }

  if (empId) {
    where.empId = parseInt(empId);
  }

  if (expenseTypeId) {
    where.expenseTypeId = parseInt(expenseTypeId);
  }

  if (statusEng) {
    where.statusEng = statusEng;
  }

  if (statusHo) {
    where.statusHo = statusHo;
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

  if (minAmount || maxAmount) {
    where.amount = {};
    if (minAmount) {
      where.amount.gte = parseFloat(minAmount);
    }
    if (maxAmount) {
      where.amount.lte = parseFloat(maxAmount);
    }
  }

  // Get allocations with pagination
  const [allocations, total] = await Promise.all([
    prisma.allocation.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        },
        expenseType: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.allocation.count({ where })
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: allocations,
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

// Get allocation by ID
const getAllocationById = asyncHandler(async (req, res) => {
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
          phone: true,
          role: true,
          head1: true,
          head2: true
        }
      },
      expenseType: {
        select: {
          id: true,
          name: true,
          status: true
        }
      }
    }
  });

  if (!allocation) {
    return res.status(404).json({
      success: false,
      error: 'Allocation not found'
    });
  }

  res.json({
    success: true,
    data: allocation
  });
});

// Create new allocation
const createAllocation = asyncHandler(async (req, res) => {
  const {
    allocationDate,
    empId,
    expenseTypeId,
    amount,
    remarks,
    billNumber,
    billDate,
    notes,
    originalBill = false
  } = req.body;

  // Verify employee exists
  const employee = await prisma.employee.findUnique({
    where: { id: parseInt(empId) }
  });

  if (!employee) {
    return res.status(400).json({
      success: false,
      error: 'Employee not found'
    });
  }

  // Verify expense type exists
  const expenseType = await prisma.expenseType.findUnique({
    where: { id: parseInt(expenseTypeId) }
  });

  if (!expenseType) {
    return res.status(400).json({
      success: false,
      error: 'Expense type not found'
    });
  }

  if (!expenseType.status) {
    return res.status(400).json({
      success: false,
      error: 'Expense type is inactive'
    });
  }

  // Handle file upload if present
  let fileUrl = null;
  if (req.file) {
    try {
      fileUrl = await uploadFile(req.file, 'allocations');
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'File upload failed',
        message: error.message
      });
    }
  }

  const allocation = await prisma.allocation.create({
    data: {
      allocationDate: new Date(allocationDate),
      empId: parseInt(empId),
      expenseTypeId: parseInt(expenseTypeId),
      amount: parseFloat(amount),
      remarks,
      billNumber,
      billDate: billDate ? new Date(billDate) : null,
      fileUrl,
      notes,
      originalBill
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      },
      expenseType: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    message: 'Allocation created successfully',
    data: allocation
  });
});

// Update allocation
const updateAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    allocationDate,
    empId,
    expenseTypeId,
    amount,
    remarks,
    billNumber,
    billDate,
    notes,
    originalBill
  } = req.body;

  // Check if allocation exists
  const existingAllocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingAllocation) {
    return res.status(404).json({
      success: false,
      error: 'Allocation not found'
    });
  }

  // Verify employee if provided
  if (empId) {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(empId) }
    });

    if (!employee) {
      return res.status(400).json({
        success: false,
        error: 'Employee not found'
      });
    }
  }

  // Verify expense type if provided
  if (expenseTypeId) {
    const expenseType = await prisma.expenseType.findUnique({
      where: { id: parseInt(expenseTypeId) }
    });

    if (!expenseType) {
      return res.status(400).json({
        success: false,
        error: 'Expense type not found'
      });
    }

    if (!expenseType.status) {
      return res.status(400).json({
        success: false,
        error: 'Expense type is inactive'
      });
    }
  }

  // Handle file upload if present
  let fileUrl = existingAllocation.fileUrl;
  if (req.file) {
    try {
      fileUrl = await uploadFile(req.file, 'allocations');
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'File upload failed',
        message: error.message
      });
    }
  }

  const allocation = await prisma.allocation.update({
    where: { id: parseInt(id) },
    data: {
      ...(allocationDate && { allocationDate: new Date(allocationDate) }),
      ...(empId && { empId: parseInt(empId) }),
      ...(expenseTypeId && { expenseTypeId: parseInt(expenseTypeId) }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(remarks !== undefined && { remarks }),
      ...(billNumber !== undefined && { billNumber }),
      ...(billDate !== undefined && { billDate: billDate ? new Date(billDate) : null }),
      ...(fileUrl && { fileUrl }),
      ...(notes !== undefined && { notes }),
      ...(originalBill !== undefined && { originalBill })
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true
        }
      },
      expenseType: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  res.json({
    success: true,
    message: 'Allocation updated successfully',
    data: allocation
  });
});

// Delete allocation
const deleteAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if allocation exists
  const allocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) }
  });

  if (!allocation) {
    return res.status(404).json({
      success: false,
      error: 'Allocation not found'
    });
  }

  await prisma.allocation.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Allocation deleted successfully'
  });
});

// Engineer verification
const verifyAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approved, notes } = req.body;

  const allocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) }
  });

  if (!allocation) {
    return res.status(404).json({
      success: false,
      error: 'Allocation not found'
    });
  }

  const updatedAllocation = await prisma.allocation.update({
    where: { id: parseInt(id) },
    data: {
      statusEng: approved ? 'APPROVED' : 'REJECTED',
      notesEng: notes
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      expenseType: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  // Create notification for employee
  await prisma.notification.create({
    data: {
      userId: allocation.empId,
      message: `Your allocation has been ${approved ? 'approved' : 'rejected'} by engineer.`
    }
  });

  res.json({
    success: true,
    message: `Allocation ${approved ? 'approved' : 'rejected'} successfully`,
    data: updatedAllocation
  });
});

// HO approval
const approveAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approved, notes } = req.body;

  const allocation = await prisma.allocation.findUnique({
    where: { id: parseInt(id) }
  });

  if (!allocation) {
    return res.status(404).json({
      success: false,
      error: 'Allocation not found'
    });
  }

  // Check if engineer has approved first
  if (allocation.statusEng !== 'APPROVED') {
    return res.status(400).json({
      success: false,
      error: 'Engineer approval required',
      message: 'Allocation must be approved by engineer first'
    });
  }

  const updatedAllocation = await prisma.allocation.update({
    where: { id: parseInt(id) },
    data: {
      statusHo: approved ? 'APPROVED' : 'REJECTED',
      notesHo: notes
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      },
      expenseType: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  // Create notification for employee
  await prisma.notification.create({
    data: {
      userId: allocation.empId,
      message: `Your allocation has been ${approved ? 'approved' : 'rejected'} by HO.`
    }
  });

  res.json({
    success: true,
    message: `Allocation ${approved ? 'approved' : 'rejected'} successfully`,
    data: updatedAllocation
  });
});

// Get allocation statistics
const getAllocationStats = asyncHandler(async (req, res) => {
  const [
    totalAllocations,
    pendingEng,
    approvedEng,
    rejectedEng,
    pendingHo,
    approvedHo,
    rejectedHo,
    totalAmount,
    monthlyStats
  ] = await Promise.all([
    prisma.allocation.count(),
    prisma.allocation.count({ where: { statusEng: 'PENDING' } }),
    prisma.allocation.count({ where: { statusEng: 'APPROVED' } }),
    prisma.allocation.count({ where: { statusEng: 'REJECTED' } }),
    prisma.allocation.count({ where: { statusHo: 'PENDING' } }),
    prisma.allocation.count({ where: { statusHo: 'APPROVED' } }),
    prisma.allocation.count({ where: { statusHo: 'REJECTED' } }),
    prisma.allocation.aggregate({
      _sum: { amount: true }
    }),
    prisma.allocation.groupBy({
      by: ['allocationDate'],
      _sum: { amount: true },
      _count: { id: true },
      where: {
        allocationDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
        }
      },
      orderBy: { allocationDate: 'asc' }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalAllocations,
      engineerStatus: {
        pending: pendingEng,
        approved: approvedEng,
        rejected: rejectedEng
      },
      hoStatus: {
        pending: pendingHo,
        approved: approvedHo,
        rejected: rejectedHo
      },
      totalAmount: totalAmount._sum.amount || 0,
      monthlyStats
    }
  });
});

module.exports = {
  getAllocations,
  getAllocationById,
  createAllocation,
  updateAllocation,
  deleteAllocation,
  verifyAllocation,
  approveAllocation,
  getAllocationStats
};