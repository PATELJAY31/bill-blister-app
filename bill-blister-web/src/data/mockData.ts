import { Claim, Allocation, ExpenseType } from '@/types';

export const mockAllocations: Allocation[] = [
  {
    id: '1',
    allocationDate: '2024-01-15',
    employeeName: 'Saloni Jadav',
    expenseType: 'Food',
    cashIssued: 100.00,
    updatedOn: '2024-01-15T10:30:00Z',
    updatedBy: 'Admin',
  },
  {
    id: '2',
    allocationDate: '2024-01-16',
    employeeName: 'Nehal',
    expenseType: 'Travel',
    lpoNumber: 'LPO-0031',
    cashIssued: 450.50,
    updatedOn: '2024-01-16T14:20:00Z',
    updatedBy: 'Admin',
  },
  {
    id: '3',
    allocationDate: '2024-01-17',
    employeeName: 'Aarav',
    expenseType: 'Supplies',
    cashIssued: 20.00,
    updatedOn: '2024-01-17T09:15:00Z',
    updatedBy: 'Admin',
  },
  {
    id: '4',
    allocationDate: '2024-01-18',
    employeeName: 'Priya Sharma',
    expenseType: 'Office Supplies',
    lpoNumber: 'LPO-0032',
    cashIssued: 75.25,
    updatedOn: '2024-01-18T11:45:00Z',
    updatedBy: 'Admin',
  },
  {
    id: '5',
    allocationDate: '2024-01-19',
    employeeName: 'Raj Patel',
    expenseType: 'Travel',
    cashIssued: 300.00,
    updatedOn: '2024-01-19T16:30:00Z',
    updatedBy: 'Admin',
  },
];

export const mockClaims: Claim[] = [
  {
    id: '1',
    employeeName: 'Saloni Jadav',
    expenseType: 'Conference & Trade Show Registration',
    lpoNumber: 'LPO-0029',
    billDate: '15-01-2024',
    submittedDate: '15-01-2024',
    billAmount: 1500.00,
    engineerStatus: 'pending',
    hoStatus: 'pending',
    receiptPath: '/receipts/conference-receipt.jpg',
    notes: 'Annual tech conference registration fee',
  },
  {
    id: '2',
    employeeName: 'Nehal',
    expenseType: 'Travel',
    lpoNumber: 'LPO-0030',
    billDate: '16-01-2024',
    submittedDate: '16-01-2024',
    billAmount: 850.75,
    engineerStatus: 'approved',
    hoStatus: 'pending',
    receiptPath: '/receipts/travel-receipt.pdf',
    notes: 'Client meeting travel expenses',
  },
  {
    id: '3',
    employeeName: 'Aarav',
    expenseType: 'Office Supplies',
    billDate: '17-01-2024',
    submittedDate: '17-01-2024',
    billAmount: 125.50,
    engineerStatus: 'rejected',
    hoStatus: 'rejected',
    receiptPath: '/receipts/supplies-receipt.jpg',
    notes: 'Stationery and office materials',
  },
  {
    id: '4',
    employeeName: 'Priya Sharma',
    expenseType: 'Food',
    billDate: '18-01-2024',
    submittedDate: '18-01-2024',
    billAmount: 200.00,
    engineerStatus: 'approved',
    hoStatus: 'approved',
    receiptPath: '/receipts/food-receipt.jpg',
    notes: 'Team lunch meeting',
  },
];

export const expenseTypes: ExpenseType[] = [
  { id: '1', name: 'Food', icon: '🍽️' },
  { id: '2', name: 'Travel', icon: '✈️' },
  { id: '3', name: 'Office Supplies', icon: '📋' },
  { id: '4', name: 'Conference & Trade Show Registration', icon: '🎫' },
  { id: '5', name: 'Accommodation', icon: '🏨' },
  { id: '6', name: 'Transportation', icon: '🚗' },
  { id: '7', name: 'Entertainment', icon: '🎭' },
  { id: '8', name: 'Other', icon: '📄' },
];

export const getTotalCashIssued = (): number => {
  return mockAllocations.reduce((total, allocation) => total + allocation.cashIssued, 0);
};

export const getClaimsByStatus = (status: 'pending' | 'approved' | 'rejected') => {
  return mockClaims.filter(claim => claim.engineerStatus === status);
};

export const getFilteredAllocations = (filters: {
  employeeName?: string;
  expenseType?: string;
}) => {
  return mockAllocations.filter(allocation => {
    if (filters.employeeName && !allocation.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())) {
      return false;
    }
    if (filters.expenseType && allocation.expenseType !== filters.expenseType) {
      return false;
    }
    return true;
  });
};
