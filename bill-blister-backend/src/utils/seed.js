require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.notification.deleteMany();
    await prisma.allocation.deleteMany();
    await prisma.employee.deleteMany();
    await prisma.expenseType.deleteMany();
    await prisma.head1.deleteMany();
    await prisma.head2.deleteMany();

    console.log('🗑️ Cleared existing data');

    // Create Head1 entries
    const head1Entries = await prisma.head1.createMany({
      data: [
        { name: 'Engineering', status: true },
        { name: 'Sales', status: true },
        { name: 'Marketing', status: true },
        { name: 'HR', status: true },
        { name: 'Finance', status: true },
      ],
    });

    console.log('✅ Created Head1 entries');

    // Create Head2 entries
    const head2Entries = await prisma.head2.createMany({
      data: [
        { name: 'Development', status: true },
        { name: 'QA', status: true },
        { name: 'DevOps', status: true },
        { name: 'Business Development', status: true },
        { name: 'Digital Marketing', status: true },
        { name: 'Recruitment', status: true },
        { name: 'Accounting', status: true },
      ],
    });

    console.log('✅ Created Head2 entries');

    // Create expense types
    const expenseTypes = await prisma.expenseType.createMany({
      data: [
        { name: 'Food', status: true },
        { name: 'Travel', status: true },
        { name: 'Office Supplies', status: true },
        { name: 'Conference & Trade Show Registration', status: true },
        { name: 'Accommodation', status: true },
        { name: 'Transportation', status: true },
        { name: 'Entertainment', status: true },
        { name: 'Other', status: true },
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
          loginName: 'admin',
          role: 'ADMIN',
          phone: '+1234567890',
          status: 'active',
          joiningDate: new Date('2023-01-01'),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
          head1: 'Engineering',
          head2: 'Development',
        },
        {
          firstName: 'John',
          lastName: 'Engineer',
          email: 'engineer@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'engineer',
          role: 'ENGINEER',
          phone: '+1234567891',
          status: 'active',
          joiningDate: new Date('2023-02-01'),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
          head1: 'Engineering',
          head2: 'Development',
        },
        {
          firstName: 'Jane',
          lastName: 'Approver',
          email: 'approver@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'approver',
          role: 'APPROVER',
          phone: '+1234567892',
          status: 'active',
          joiningDate: new Date('2023-03-01'),
          country: 'USA',
          state: 'California',
          city: 'San Francisco',
          head1: 'Finance',
          head2: 'Accounting',
        },
        {
          firstName: 'Saloni',
          lastName: 'Jadav',
          email: 'saloni.jadav@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'saloni.jadav',
          role: 'EMPLOYEE',
          phone: '+1234567893',
          status: 'active',
          joiningDate: new Date('2023-04-01'),
          country: 'India',
          state: 'Maharashtra',
          city: 'Mumbai',
          head1: 'Engineering',
          head2: 'Development',
        },
        {
          firstName: 'Nehal',
          lastName: 'Patel',
          email: 'nehal.patel@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'nehal.patel',
          role: 'EMPLOYEE',
          phone: '+1234567894',
          status: 'active',
          joiningDate: new Date('2023-05-01'),
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
          head1: 'Sales',
          head2: 'Business Development',
        },
        {
          firstName: 'Aarav',
          lastName: 'Sharma',
          email: 'aarav.sharma@billblister.com',
          passwordHash: hashedPassword,
          loginName: 'aarav.sharma',
          role: 'EMPLOYEE',
          phone: '+1234567895',
          status: 'active',
          joiningDate: new Date('2023-06-01'),
          country: 'India',
          state: 'Delhi',
          city: 'New Delhi',
          head1: 'Marketing',
          head2: 'Digital Marketing',
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
          empId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Food').id,
          amount: 100.00,
          remarks: 'Monthly food allowance',
          statusEng: 'APPROVED',
          statusHo: 'PENDING',
          notesEng: 'Approved by engineer',
        },
        {
          allocationDate: new Date('2024-01-16'),
          empId: createdEmployees.find(e => e.firstName === 'Nehal').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Travel').id,
          amount: 450.50,
          remarks: 'Client meeting travel',
          billNumber: 'LPO-0031',
          billDate: new Date('2024-01-16'),
          statusEng: 'APPROVED',
          statusHo: 'APPROVED',
          notesEng: 'Approved by engineer',
          notesHo: 'Approved by HO',
        },
        {
          allocationDate: new Date('2024-01-17'),
          empId: createdEmployees.find(e => e.firstName === 'Aarav').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Office Supplies').id,
          amount: 20.00,
          remarks: 'Stationery supplies',
          statusEng: 'PENDING',
          statusHo: 'PENDING',
        },
        {
          allocationDate: new Date('2024-01-18'),
          empId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          expenseTypeId: createdExpenseTypes.find(et => et.name === 'Conference & Trade Show Registration').id,
          amount: 1500.00,
          remarks: 'Annual tech conference registration',
          billNumber: 'LPO-0029',
          billDate: new Date('2024-01-18'),
          statusEng: 'REJECTED',
          statusHo: 'PENDING',
          notesEng: 'Insufficient documentation provided',
        },
      ],
    });

    console.log('✅ Created allocations');

    // Create sample notifications
    const notifications = await prisma.notification.createMany({
      data: [
        {
          userId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          message: 'Your allocation for ₹100.00 has been approved by engineer.',
          isRead: false,
        },
        {
          userId: createdEmployees.find(e => e.firstName === 'Nehal').id,
          message: 'Your allocation for ₹450.50 has been approved by HO.',
          isRead: false,
        },
        {
          userId: createdEmployees.find(e => e.firstName === 'Aarav').id,
          message: 'Your allocation for ₹20.00 is pending engineer approval.',
          isRead: true,
        },
        {
          userId: createdEmployees.find(e => e.firstName === 'Saloni').id,
          message: 'Your allocation for ₹1,500.00 has been rejected by engineer.',
          isRead: false,
        },
      ],
    });

    console.log('✅ Created notifications');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts created:');
    console.log('Admin: admin@billblister.com / password123');
    console.log('Engineer: engineer@billblister.com / password123');
    console.log('HO Approver: approver@billblister.com / password123');
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