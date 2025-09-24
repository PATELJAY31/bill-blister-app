const { prisma } = require('../config/database');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/response');
const { catchAsync } = require('../middlewares/errorHandler');
const { paginate } = require('../utils/response');
const { uploadFile, generateFilePath } = require('../utils/fileUpload');
const { initializeFirebase } = require('../config/firebase');

// Initialize Firebase
initializeFirebase();

// Get all claims with pagination and filtering
const getClaims = catchAsync(async (req, res) => {
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
      { description: { contains: search, mode: 'insensitive' } },
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
    where.billDate = {};
    if (startDate) {
      where.billDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.billDate.lte = new Date(endDate);
    }
  }

  // Get claims with pagination
  const [claims, total] = await Promise.all([
    prisma.claim.findMany({
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
        allocation: {
          select: {
            id: true,
            amount: true,
            allocationDate: true,
          },
        },
        verifiedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      ...pagination,
    }),
    prisma.claim.count({ where }),
  ]);

  return paginatedResponse(res, { results: claims, total }, pagination, 'Claims retrieved successfully');
});

// Get claim by ID
const getClaimById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const claim = await prisma.claim.findUnique({
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
      allocation: {
        select: {
          id: true,
          amount: true,
          allocationDate: true,
          status: true,
        },
      },
      verifiedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (!claim) {
    return errorResponse(res, 404, 'Claim not found');
  }

  return successResponse(res, 200, 'Claim retrieved successfully', { claim });
});

// Create new claim
const createClaim = catchAsync(async (req, res) => {
  const {
    employeeId,
    expenseTypeId,
    allocationId,
    amount,
    description,
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
    return errorResponse(res, 400, 'Cannot create claim for inactive employee');
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
    return errorResponse(res, 400, 'Cannot create claim for inactive expense type');
  }

  // Verify allocation exists if provided
  if (allocationId) {
    const allocation = await prisma.allocation.findUnique({
      where: { id: parseInt(allocationId) },
      select: { id: true, status: true, employeeId: true },
    });

    if (!allocation) {
      return errorResponse(res, 404, 'Allocation not found');
    }

    if (allocation.status !== 'ACTIVE') {
      return errorResponse(res, 400, 'Cannot create claim for inactive allocation');
    }

    if (allocation.employeeId !== parseInt(employeeId)) {
      return errorResponse(res, 400, 'Allocation does not belong to the specified employee');
    }
  }

  // Handle file upload if present
  let fileUrl = null;
  if (req.file) {
    try {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const filePath = generateFilePath('claims', fileName);
      fileUrl = await uploadFile(req.file, filePath);
    } catch (error) {
      console.error('File upload error:', error);
      return errorResponse(res, 500, 'File upload failed');
    }
  }

  // Create claim
  const claim = await prisma.claim.create({
    data: {
      employeeId: parseInt(employeeId),
      expenseTypeId: parseInt(expenseTypeId),
      allocationId: allocationId ? parseInt(allocationId) : null,
      amount: parseFloat(amount),
      description,
      billNumber,
      billDate: new Date(billDate),
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
      allocation: {
        select: {
          id: true,
          amount: true,
          allocationDate: true,
        },
      },
    },
  });

  return successResponse(res, 201, 'Claim created successfully', { claim });
});

// Verify claim (Engineer role)
const verifyClaim = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  // Check if user has engineer role
  if (req.user.role !== 'ENGINEER' && req.user.role !== 'ADMIN') {
    return errorResponse(res, 403, 'Only engineers can verify claims');
  }

  // Check if claim exists
  const claim = await prisma.claim.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, status: true, verifiedById: true },
  });

  if (!claim) {
    return errorResponse(res, 404, 'Claim not found');
  }

  if (claim.status !== 'PENDING') {
    return errorResponse(res, 400, 'Claim has already been processed');
  }

  // Update claim with verification
  const updatedClaim = await prisma.claim.update({
    where: { id: parseInt(id) },
    data: {
      status,
      verifiedById: req.user.id,
      verifiedAt: new Date(),
      verifiedNotes: notes,
      ...(status === 'REJECTED' && { rejectionReason: notes }),
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      expenseType: {
        select: {
          id: true,
          name: true,
        },
      },
      verifiedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return successResponse(res, 200, 'Claim verification completed successfully', { claim: updatedClaim });
});

// Approve claim (HO Approver role)
const approveClaim = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  // Check if user has HO approver role
  if (req.user.role !== 'HO_APPROVER' && req.user.role !== 'ADMIN') {
    return errorResponse(res, 403, 'Only HO approvers can approve claims');
  }

  // Check if claim exists
  const claim = await prisma.claim.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, status: true, verifiedById: true },
  });

  if (!claim) {
    return errorResponse(res, 404, 'Claim not found');
  }

  if (claim.status === 'PENDING') {
    return errorResponse(res, 400, 'Claim must be verified before approval');
  }

  if (claim.status !== 'APPROVED' || claim.verifiedById === null) {
    return errorResponse(res, 400, 'Only verified claims can be approved');
  }

  // Update claim with approval
  const updatedClaim = await prisma.claim.update({
    where: { id: parseInt(id) },
    data: {
      status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      approvedById: req.user.id,
      approvedAt: new Date(),
      approvedNotes: notes,
      ...(status === 'REJECTED' && { rejectionReason: notes }),
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      expenseType: {
        select: {
          id: true,
          name: true,
        },
      },
      verifiedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      approvedBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return successResponse(res, 200, 'Claim approval completed successfully', { claim: updatedClaim });
});

// Update claim
const updateClaim = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    expenseTypeId,
    amount,
    description,
    billNumber,
    billDate,
    notes,
  } = req.body;

  // Check if claim exists
  const existingClaim = await prisma.claim.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, status: true, employeeId: true },
  });

  if (!existingClaim) {
    return errorResponse(res, 404, 'Claim not found');
  }

  // Only allow updates for pending claims or if user is the owner
  if (existingClaim.status !== 'PENDING' && existingClaim.employeeId !== req.user.id) {
    return errorResponse(res, 400, 'Only pending claims can be updated');
  }

  // Verify expense type exists if being changed
  if (expenseTypeId && expenseTypeId !== existingClaim.expenseTypeId) {
    const expenseType = await prisma.expenseType.findUnique({
      where: { id: parseInt(expenseTypeId) },
      select: { id: true, status: true },
    });

    if (!expenseType) {
      return errorResponse(res, 404, 'Expense type not found');
    }

    if (!expenseType.status) {
      return errorResponse(res, 400, 'Cannot assign claim to inactive expense type');
    }
  }

  // Handle file upload if present
  let fileUrl = existingClaim.fileUrl;
  if (req.file) {
    try {
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const filePath = generateFilePath('claims', fileName);
      fileUrl = await uploadFile(req.file, filePath);
    } catch (error) {
      console.error('File upload error:', error);
      return errorResponse(res, 500, 'File upload failed');
    }
  }

  // Update claim
  const claim = await prisma.claim.update({
    where: { id: parseInt(id) },
    data: {
      ...(expenseTypeId && { expenseTypeId: parseInt(expenseTypeId) }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(description !== undefined && { description }),
      ...(billNumber !== undefined && { billNumber }),
      ...(billDate && { billDate: new Date(billDate) }),
      ...(notes !== undefined && { notes }),
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
      allocation: {
        select: {
          id: true,
          amount: true,
          allocationDate: true,
        },
      },
    },
  });

  return successResponse(res, 200, 'Claim updated successfully', { claim });
});

// Delete claim
const deleteClaim = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Check if claim exists
  const claim = await prisma.claim.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, status: true, employeeId: true },
  });

  if (!claim) {
    return errorResponse(res, 404, 'Claim not found');
  }

  // Only allow deletion for pending claims or if user is the owner
  if (existingClaim.status !== 'PENDING' && existingClaim.employeeId !== req.user.id) {
    return errorResponse(res, 400, 'Only pending claims can be deleted');
  }

  // Delete claim
  await prisma.claim.delete({
    where: { id: parseInt(id) },
  });

  return successResponse(res, 200, 'Claim deleted successfully');
});

// Get claim statistics
const getClaimStats = catchAsync(async (req, res) => {
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
    where.billDate = {};
    if (startDate) {
      where.billDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.billDate.lte = new Date(endDate);
    }
  }

  const [
    totalClaims,
    totalAmount,
    claimsByStatus,
    claimsByEmployee,
    claimsByExpenseType,
  ] = await Promise.all([
    prisma.claim.count({ where }),
    prisma.claim.aggregate({
      where,
      _sum: { amount: true },
    }),
    prisma.claim.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
      _sum: { amount: true },
    }),
    prisma.claim.groupBy({
      by: ['employeeId'],
      where,
      _count: { employeeId: true },
      _sum: { amount: true },
    }),
    prisma.claim.groupBy({
      by: ['expenseTypeId'],
      where,
      _count: { expenseTypeId: true },
      _sum: { amount: true },
    }),
  ]);

  const stats = {
    total: totalClaims,
    totalAmount: totalAmount._sum.amount || 0,
    byStatus: claimsByStatus.reduce((acc, item) => {
      acc[item.status] = {
        count: item._count.employeeId,
        amount: item._sum.amount || 0,
      };
      return acc;
    }, {}),
    byEmployee: claimsByEmployee.length,
    byExpenseType: claimsByExpenseType.length,
  };

  return successResponse(res, 200, 'Claim statistics retrieved successfully', { stats });
});

module.exports = {
  getClaims,
  getClaimById,
  createClaim,
  verifyClaim,
  approveClaim,
  updateClaim,
  deleteClaim,
  getClaimStats,
};
