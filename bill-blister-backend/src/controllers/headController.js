const { prisma } = require('../config/database');
const { asyncHandler } = require('../middlewares/errorHandler');

// Get all Head1 entries
const getHead1List = asyncHandler(async (req, res) => {
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

  const head1List = await prisma.head1.findMany({
    where,
    orderBy: { name: 'asc' }
  });

  res.json({
    success: true,
    data: head1List
  });
});

// Get Head1 by ID
const getHead1ById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const head1 = await prisma.head1.findUnique({
    where: { id: parseInt(id) }
  });

  if (!head1) {
    return res.status(404).json({
      success: false,
      error: 'Head1 not found'
    });
  }

  res.json({
    success: true,
    data: head1
  });
});

// Create new Head1
const createHead1 = asyncHandler(async (req, res) => {
  const { name, status = true } = req.body;

  // Check if Head1 already exists
  const existingHead1 = await prisma.head1.findUnique({
    where: { name }
  });

  if (existingHead1) {
    return res.status(400).json({
      success: false,
      error: 'Head1 already exists',
      message: 'A Head1 with this name already exists'
    });
  }

  const head1 = await prisma.head1.create({
    data: {
      name,
      status
    }
  });

  res.status(201).json({
    success: true,
    message: 'Head1 created successfully',
    data: head1
  });
});

// Update Head1
const updateHead1 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  // Check if Head1 exists
  const existingHead1 = await prisma.head1.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingHead1) {
    return res.status(404).json({
      success: false,
      error: 'Head1 not found'
    });
  }

  // Check for name conflict (excluding current Head1)
  if (name && name !== existingHead1.name) {
    const conflictHead1 = await prisma.head1.findUnique({
      where: { name }
    });

    if (conflictHead1) {
      return res.status(400).json({
        success: false,
        error: 'Head1 already exists',
        message: 'A Head1 with this name already exists'
      });
    }
  }

  const head1 = await prisma.head1.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(status !== undefined && { status })
    }
  });

  res.json({
    success: true,
    message: 'Head1 updated successfully',
    data: head1
  });
});

// Delete Head1
const deleteHead1 = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if Head1 exists
  const head1 = await prisma.head1.findUnique({
    where: { id: parseInt(id) }
  });

  if (!head1) {
    return res.status(404).json({
      success: false,
      error: 'Head1 not found'
    });
  }

  // Check if Head1 is being used by employees
  const employeesUsingHead1 = await prisma.employee.findMany({
    where: { head1: head1.name }
  });

  if (employeesUsingHead1.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete Head1',
      message: 'Head1 is being used by employees. Please reassign them first.'
    });
  }

  await prisma.head1.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Head1 deleted successfully'
  });
});

// Toggle Head1 status
const toggleHead1Status = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const head1 = await prisma.head1.findUnique({
    where: { id: parseInt(id) }
  });

  if (!head1) {
    return res.status(404).json({
      success: false,
      error: 'Head1 not found'
    });
  }

  const updatedHead1 = await prisma.head1.update({
    where: { id: parseInt(id) },
    data: {
      status: !head1.status
    }
  });

  res.json({
    success: true,
    message: `Head1 ${updatedHead1.status ? 'activated' : 'deactivated'} successfully`,
    data: updatedHead1
  });
});

// Get all Head2 entries
const getHead2List = asyncHandler(async (req, res) => {
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

  const head2List = await prisma.head2.findMany({
    where,
    orderBy: { name: 'asc' }
  });

  res.json({
    success: true,
    data: head2List
  });
});

// Get Head2 by ID
const getHead2ById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const head2 = await prisma.head2.findUnique({
    where: { id: parseInt(id) }
  });

  if (!head2) {
    return res.status(404).json({
      success: false,
      error: 'Head2 not found'
    });
  }

  res.json({
    success: true,
    data: head2
  });
});

// Create new Head2
const createHead2 = asyncHandler(async (req, res) => {
  const { name, status = true } = req.body;

  // Check if Head2 already exists
  const existingHead2 = await prisma.head2.findUnique({
    where: { name }
  });

  if (existingHead2) {
    return res.status(400).json({
      success: false,
      error: 'Head2 already exists',
      message: 'A Head2 with this name already exists'
    });
  }

  const head2 = await prisma.head2.create({
    data: {
      name,
      status
    }
  });

  res.status(201).json({
    success: true,
    message: 'Head2 created successfully',
    data: head2
  });
});

// Update Head2
const updateHead2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  // Check if Head2 exists
  const existingHead2 = await prisma.head2.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingHead2) {
    return res.status(404).json({
      success: false,
      error: 'Head2 not found'
    });
  }

  // Check for name conflict (excluding current Head2)
  if (name && name !== existingHead2.name) {
    const conflictHead2 = await prisma.head2.findUnique({
      where: { name }
    });

    if (conflictHead2) {
      return res.status(400).json({
        success: false,
        error: 'Head2 already exists',
        message: 'A Head2 with this name already exists'
      });
    }
  }

  const head2 = await prisma.head2.update({
    where: { id: parseInt(id) },
    data: {
      ...(name && { name }),
      ...(status !== undefined && { status })
    }
  });

  res.json({
    success: true,
    message: 'Head2 updated successfully',
    data: head2
  });
});

// Delete Head2
const deleteHead2 = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if Head2 exists
  const head2 = await prisma.head2.findUnique({
    where: { id: parseInt(id) }
  });

  if (!head2) {
    return res.status(404).json({
      success: false,
      error: 'Head2 not found'
    });
  }

  // Check if Head2 is being used by employees
  const employeesUsingHead2 = await prisma.employee.findMany({
    where: { head2: head2.name }
  });

  if (employeesUsingHead2.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Cannot delete Head2',
      message: 'Head2 is being used by employees. Please reassign them first.'
    });
  }

  await prisma.head2.delete({
    where: { id: parseInt(id) }
  });

  res.json({
    success: true,
    message: 'Head2 deleted successfully'
  });
});

// Toggle Head2 status
const toggleHead2Status = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const head2 = await prisma.head2.findUnique({
    where: { id: parseInt(id) }
  });

  if (!head2) {
    return res.status(404).json({
      success: false,
      error: 'Head2 not found'
    });
  }

  const updatedHead2 = await prisma.head2.update({
    where: { id: parseInt(id) },
    data: {
      status: !head2.status
    }
  });

  res.json({
    success: true,
    message: `Head2 ${updatedHead2.status ? 'activated' : 'deactivated'} successfully`,
    data: updatedHead2
  });
});

// Get head statistics
const getHeadStats = asyncHandler(async (req, res) => {
  const [
    head1Stats,
    head2Stats,
    head1Usage,
    head2Usage
  ] = await Promise.all([
    prisma.head1.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.head2.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.employee.groupBy({
      by: ['head1'],
      _count: { head1: true },
      where: {
        head1: { not: null }
      }
    }),
    prisma.employee.groupBy({
      by: ['head2'],
      _count: { head2: true },
      where: {
        head2: { not: null }
      }
    })
  ]);

  res.json({
    success: true,
    data: {
      head1: {
        stats: head1Stats,
        usage: head1Usage
      },
      head2: {
        stats: head2Stats,
        usage: head2Usage
      }
    }
  });
});

module.exports = {
  // Head1
  getHead1List,
  getHead1ById,
  createHead1,
  updateHead1,
  deleteHead1,
  toggleHead1Status,
  
  // Head2
  getHead2List,
  getHead2ById,
  createHead2,
  updateHead2,
  deleteHead2,
  toggleHead2Status,
  
  // Stats
  getHeadStats
};
