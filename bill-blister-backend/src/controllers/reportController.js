const { prisma } = require('../config/database');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get allocation reports
const getAllocationReports = asyncHandler(async (req, res) => {
  const {
    startDate,
    endDate,
    empId,
    expenseTypeId,
    statusEng,
    statusHo,
    groupBy = 'month',
    format = 'json'
  } = req.query;

  // Build where clause
  const where = {};

  if (startDate || endDate) {
    where.allocationDate = {};
    if (startDate) {
      where.allocationDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.allocationDate.lte = new Date(endDate);
    }
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

  // Get allocations with related data
  const allocations = await prisma.allocation.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          head1: true,
          head2: true
        }
      },
      expenseType: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { allocationDate: 'desc' }
  });

  // Calculate summary statistics
  const summary = {
    totalAllocations: allocations.length,
    totalAmount: allocations.reduce((sum, alloc) => sum + parseFloat(alloc.amount), 0),
    averageAmount: allocations.length > 0 ? 
      allocations.reduce((sum, alloc) => sum + parseFloat(alloc.amount), 0) / allocations.length : 0,
    statusBreakdown: {
      engineer: {
        pending: allocations.filter(a => a.statusEng === 'PENDING').length,
        approved: allocations.filter(a => a.statusEng === 'APPROVED').length,
        rejected: allocations.filter(a => a.statusEng === 'REJECTED').length
      },
      ho: {
        pending: allocations.filter(a => a.statusHo === 'PENDING').length,
        approved: allocations.filter(a => a.statusHo === 'APPROVED').length,
        rejected: allocations.filter(a => a.statusHo === 'REJECTED').length
      }
    }
  };

  // Group data based on groupBy parameter
  let groupedData = {};
  
  if (groupBy === 'month') {
    groupedData = allocations.reduce((groups, allocation) => {
      const month = allocation.allocationDate.toISOString().substring(0, 7); // YYYY-MM
      if (!groups[month]) {
        groups[month] = {
          month,
          count: 0,
          totalAmount: 0,
          allocations: []
        };
      }
      groups[month].count++;
      groups[month].totalAmount += parseFloat(allocation.amount);
      groups[month].allocations.push(allocation);
      return groups;
    }, {});
  } else if (groupBy === 'employee') {
    groupedData = allocations.reduce((groups, allocation) => {
      const empId = allocation.employee.id;
      if (!groups[empId]) {
        groups[empId] = {
          employee: allocation.employee,
          count: 0,
          totalAmount: 0,
          allocations: []
        };
      }
      groups[empId].count++;
      groups[empId].totalAmount += parseFloat(allocation.amount);
      groups[empId].allocations.push(allocation);
      return groups;
    }, {});
  } else if (groupBy === 'expenseType') {
    groupedData = allocations.reduce((groups, allocation) => {
      const typeId = allocation.expenseType.id;
      if (!groups[typeId]) {
        groups[typeId] = {
          expenseType: allocation.expenseType,
          count: 0,
          totalAmount: 0,
          allocations: []
        };
      }
      groups[typeId].count++;
      groups[typeId].totalAmount += parseFloat(allocation.amount);
      groups[typeId].allocations.push(allocation);
      return groups;
    }, {});
  }

  res.json({
    success: true,
    data: {
      summary,
      groupedData: Object.values(groupedData),
      rawData: format === 'detailed' ? allocations : undefined
    }
  });
});

// Get claim reports (same as allocation reports for this system)
const getClaimReports = asyncHandler(async (req, res) => {
  // Claims are the same as allocations in this system
  return getAllocationReports(req, res);
});

// Get employee reports
const getEmployeeReports = asyncHandler(async (req, res) => {
  const {
    role,
    status,
    head1,
    head2,
    joiningDateStart,
    joiningDateEnd,
    groupBy = 'role'
  } = req.query;

  // Build where clause
  const where = {};

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

  if (joiningDateStart || joiningDateEnd) {
    where.joiningDate = {};
    if (joiningDateStart) {
      where.joiningDate.gte = new Date(joiningDateStart);
    }
    if (joiningDateEnd) {
      where.joiningDate.lte = new Date(joiningDateEnd);
    }
  }

  // Get employees with allocation data
  const employees = await prisma.employee.findMany({
    where,
    include: {
      _count: {
        select: {
          allocations: true
        }
      },
      allocations: {
        select: {
          id: true,
          amount: true,
          allocationDate: true,
          statusEng: true,
          statusHo: true
        }
      },
      reportingManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate summary statistics
  const summary = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'active').length,
    inactiveEmployees: employees.filter(emp => emp.status === 'inactive').length,
    employeesWithAllocations: employees.filter(emp => emp._count.allocations > 0).length,
    totalAllocationAmount: employees.reduce((sum, emp) => 
      sum + emp.allocations.reduce((empSum, alloc) => empSum + parseFloat(alloc.amount), 0), 0
    )
  };

  // Group data based on groupBy parameter
  let groupedData = {};
  
  if (groupBy === 'role') {
    groupedData = employees.reduce((groups, employee) => {
      const role = employee.role;
      if (!groups[role]) {
        groups[role] = {
          role,
          count: 0,
          employees: []
        };
      }
      groups[role].count++;
      groups[role].employees.push(employee);
      return groups;
    }, {});
  } else if (groupBy === 'head1') {
    groupedData = employees.reduce((groups, employee) => {
      const head1 = employee.head1 || 'Not Assigned';
      if (!groups[head1]) {
        groups[head1] = {
          head1,
          count: 0,
          employees: []
        };
      }
      groups[head1].count++;
      groups[head1].employees.push(employee);
      return groups;
    }, {});
  } else if (groupBy === 'head2') {
    groupedData = employees.reduce((groups, employee) => {
      const head2 = employee.head2 || 'Not Assigned';
      if (!groups[head2]) {
        groups[head2] = {
          head2,
          count: 0,
          employees: []
        };
      }
      groups[head2].count++;
      groups[head2].employees.push(employee);
      return groups;
    }, {});
  }

  res.json({
    success: true,
    data: {
      summary,
      groupedData: Object.values(groupedData)
    }
  });
});

// Get expense type reports
const getExpenseTypeReports = asyncHandler(async (req, res) => {
  const { status, startDate, endDate } = req.query;

  const where = {};

  if (status !== undefined) {
    where.status = status === 'true';
  }

  // Get expense types with allocation data
  const expenseTypes = await prisma.expenseType.findMany({
    where,
    include: {
      _count: {
        select: {
          allocations: true
        }
      },
      allocations: {
        where: startDate || endDate ? {
          allocationDate: {
            ...(startDate && { gte: new Date(startDate) }),
            ...(endDate && { lte: new Date(endDate) })
          }
        } : undefined,
        select: {
          id: true,
          amount: true,
          allocationDate: true,
          statusEng: true,
          statusHo: true,
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Calculate summary statistics
  const summary = {
    totalExpenseTypes: expenseTypes.length,
    activeExpenseTypes: expenseTypes.filter(et => et.status).length,
    inactiveExpenseTypes: expenseTypes.filter(et => !et.status).length,
    expenseTypesWithAllocations: expenseTypes.filter(et => et._count.allocations > 0).length,
    totalAllocationAmount: expenseTypes.reduce((sum, et) => 
      sum + et.allocations.reduce((etSum, alloc) => etSum + parseFloat(alloc.amount), 0), 0
    )
  };

  res.json({
    success: true,
    data: {
      summary,
      expenseTypes: expenseTypes.map(et => ({
        ...et,
        totalAmount: et.allocations.reduce((sum, alloc) => sum + parseFloat(alloc.amount), 0),
        averageAmount: et.allocations.length > 0 ? 
          et.allocations.reduce((sum, alloc) => sum + parseFloat(alloc.amount), 0) / et.allocations.length : 0
      }))
    }
  });
});

// Get dashboard statistics
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    employeeStats,
    allocationStats,
    expenseTypeStats,
    recentAllocations,
    recentEmployees
  ] = await Promise.all([
    prisma.employee.groupBy({
      by: ['status', 'role'],
      _count: { id: true }
    }),
    prisma.allocation.groupBy({
      by: ['statusEng', 'statusHo'],
      _count: { id: true },
      _sum: { amount: true }
    }),
    prisma.expenseType.groupBy({
      by: ['status'],
      _count: { id: true }
    }),
    prisma.allocation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        expenseType: {
          select: {
            name: true
          }
        }
      }
    }),
    prisma.employee.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true
      }
    })
  ]);

  res.json({
    success: true,
    data: {
      employeeStats,
      allocationStats,
      expenseTypeStats,
      recentAllocations,
      recentEmployees
    }
  });
});

module.exports = {
  getAllocationReports,
  getClaimReports,
  getEmployeeReports,
  getExpenseTypeReports,
  getDashboardStats
};
