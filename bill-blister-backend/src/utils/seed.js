const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.notification.deleteMany();
    await prisma.claim.deleteMany();
    await prisma.allocation.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.expenseType.deleteMany();

    console.log('🗑️ Cleared existing data');

    // Create expense types
    const expenseTypes = await prisma.expenseType.createMany({
      data: [
        { name: 'Food', description: 'Meals and food expenses', status: true },
        { name: 'Travel', description: 'Transportation and travel expenses', status: true },
        { name: 'Office Supplies', description: 'Stationery and office materials', status: true },
        { name: 'Conference & Trade Show Registration', description: 'Event registration fees', status: true },
        { name: 'Accommodation', description: 'Hotel and lodging expenses', status: true },
        { name: 'Transportation', description: 'Local transportation costs', status: true },
        { name: 'Entertainment', description: 'Client entertainment expenses', status: true },
        { name: 'Other', description: 'Miscellaneous expenses', status: true },
      ],
    });

    console.log('✅ Created expense types');

    // Get created expense types
    const createdExpenseTypes = await prisma.expenseType.findMany();

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create employees
    const employees = await prisma.employee.createMany({
      data: [
        {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'admin@billblister.com',
          role: 'ADMIN',
          phone: '+1234567890',
          status: 'ACTIVE',
          joiningDate: new Date('2023-01-01'),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
        },
        {
          firstName: 'John',
          lastName: 'Engineer',
          email: 'john.engineer@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'john.engineer@billblister.com',
          role: 'ENGINEER',
          phone: '+1234567891',
          status: 'ACTIVE',
          joiningDate: new Date('2023-02-01'),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
        },
        {
          firstName: 'Jane',
          lastName: 'Approver',
          email: 'jane.approver@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'jane.approver@billblister.com',
          role: 'HO_APPROVER',
          phone: '+1234567892',
          status: 'ACTIVE',
          joiningDate: new Date('2023-03-01'),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
        },
        {
          firstName: 'Saloni',
          lastName: 'Jadav',
          email: 'saloni.jadav@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'saloni.jadav@billblister.com',
          role: 'EMPLOYEE',
          phone: '+1234567893',
          status: 'ACTIVE',
          joiningDate: new Date('2023-04-01'),
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
        },
        {
          firstName: 'Nehal',
          lastName: 'Patel',
          email: 'nehal.patel@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'nehal.patel@billblister.com',
          role: 'EMPLOYEE',
          phone: '+1234567894',
          status: 'ACTIVE',
          joiningDate: new Date('2023-05-01'),
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
        },
        {
          firstName: 'Aarav',
          lastName: 'Sharma',
          email: 'aarav.sharma@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'aarav.sharma@billblister.com',
          role: 'EMPLOYEE',
          phone: '+1234567895',
          status: 'ACTIVE',
          joiningDate: new Date('2023-06-01'),
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
        },
      ],
    });

    console.log('✅ Created employees');

    // Get created employees
    const createdEmployees = await prisma.employee.findMany();

    // Set reporting managers
    await prisma.employee.updateMany({
      where: { role: 'EMPLOYEE' },
      data: { reportingManagerId: createdEmployees.find(e => e.role === 'ENGINEER').id },
    });

    // Create sample allocations
    const allocations = await prisma.allocation.createMany({
      data: [
        {
          allocationDate: new Date('2024-01-15'),
          employeeId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Food').id,
          amount: 100.00,
          remarks: 'Monthly food allowance',
          status: 'ACTIVE',
        },
        {
          allocationDate: new Date('2024-01-16'),
          employeeId: createdEmployees.find(e => e.firstName === 'Nehal').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Travel').id,
          amount: 450.50,
          remarks: 'Client meeting travel',
          billNumber: 'LPO-0031',
          status: 'ACTIVE',
        },
        {
          allocationDate: new Date('2024-01-17'),
          employeeId: createdEmployees.find(e => e.firstName === 'Aarav').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Office Supplies').id,
          amount: 20.00,
          remarks: 'Stationery supplies',
          status: 'ACTIVE',
        },
      ],
    });

    console.log('✅ Created allocations');

    // Get created allocations
    const createdAllocations = await prisma.allocation.findMany();

    // Create sample claims
    const claims = await prisma.claim.createMany({
      data: [
        {
          employeeId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Conference & Trade Show Registration').id,
          allocationId: createdAllocations[0].id,
          amount: 1500.00,
          description: 'Annual tech conference registration fee',
          billNumber: 'LPO-0029',
          billDate: new Date('2024-01-15'),
          notes: 'Annual tech conference registration fee',
          status: 'PENDING',
        },
        {
          employeeId: createdEmployees.find(e => e.firstName === 'Nehal').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Travel').id,
          allocationId: createdAllocations[1].id,
          amount: 850.75,
          description: 'Client meeting travel expenses',
          billNumber: 'LPO-0030',
          billDate: new Date('2024-01-16'),
          notes: 'Client meeting travel expenses',
          status: 'APPROVED',
          verifiedById: createdEmployees.find(e => e.role === 'ENGINEER').id,
          verifiedAt: new Date('2024-01-17'),
          verifiedNotes: 'Approved - all receipts provided',
          approvedById: createdEmployees.find(e => e.role === 'HO_APPROVER').id,
          approvedAt: new Date('2024-01-18'),
          approvedNotes: 'Approved by HO',
        },
        {
          employeeId: createdEmployees.find(e => e.firstName === 'Aarav').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Office Supplies').id,
          allocationId: createdAllocations[2].id,
          amount: 125.50,
          description: 'Stationery and office materials',
          billDate: new Date('2024-01-17'),
          notes: 'Stationery and office materials',
          status: 'REJECTED',
          verifiedById: createdEmployees.find(e => e.role === 'ENGINEER').id,
          verifiedAt: new Date('2024-01-18'),
          verifiedNotes: 'Rejected - insufficient documentation',
          rejectionReason: 'Please provide detailed receipts for all items',
        },
      ],
    });

    console.log('✅ Created claims');

    // Create sample notifications
    const notifications = await prisma.notification.createMany({
      data: [
        {
          employeeId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          title: 'Claim Submitted',
          message: 'Your expense claim for ₹1,500.00 has been submitted and is pending verification.',
          type: 'INFO',
        },
        {
          employeeId: createdEmployees.find(e => e.firstName === 'Nehal').id,
          title: 'Claim Approved',
          message: 'Your expense claim for ₹850.75 has been approved by the engineer.',
          type: 'SUCCESS',
        },
        {
          employeeId: createdEmployees.find(e => e.firstName === 'Aarav').id,
          title: 'Claim Rejected',
          message: 'Your expense claim for ₹125.50 has been rejected. Please check the reason and resubmit.',
          type: 'ERROR',
        },
      ],
    });

    console.log('✅ Created notifications');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts created:');
    console.log('Admin: admin@billblister.com / password123');
    console.log('Engineer: john.engineer@billblister.com / password123');
    console.log('HO Approver: jane.approver@billblister.com / password123');
    console.log('Employee: saloni.jadav@billblister.com / password123');
    console.log('Employee: nehal.patel@billblister.com / password123');
    console.log('Employee: aarav.sharma@billblister.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;
