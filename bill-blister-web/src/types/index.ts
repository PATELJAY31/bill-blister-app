// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  reportingManagerId?: string;
  joiningDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'ENGINEER' | 'HO_APPROVER';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Claim Types
export interface Claim {
  id: string;
  employeeId: string;
  employee: User;
  expenseTypeId: string;
  expenseType: ExpenseType;
  allocationId?: string;
  allocation?: Allocation;
  amount: number;
  description?: string;
  billNumber?: string;
  billDate: string;
  fileUrl?: string;
  notes?: string;
  status: ClaimStatus;
  verifiedById?: string;
  verifiedBy?: User;
  verifiedAt?: string;
  verifiedNotes?: string;
  approvedById?: string;
  approvedBy?: User;
  approvedAt?: string;
  approvedNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Allocation Types
export interface Allocation {
  id: string;
  allocationDate: string;
  employeeId: string;
  employee: User;
  expenseTypeId: string;
  expenseType: ExpenseType;
  amount: number;
  remarks?: string;
  billNumber?: string;
  billDate?: string;
  fileUrl?: string;
  notes?: string;
  status: AllocationStatus;
  statusEng?: string;
  notesEng?: string;
  statusHo?: string;
  notesHo?: string;
  originalBill: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AllocationStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

// Expense Type Types
export interface ExpenseType {
  id: string;
  name: string;
  description?: string;
  head1?: string;
  head2?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  employeeId: string;
  employee: User;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

// File Upload Types
export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  isImage: boolean;
  uploadedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalAllocations: number;
  totalAmount: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'CLAIM_CREATED' | 'CLAIM_VERIFIED' | 'CLAIM_APPROVED' | 'CLAIM_REJECTED' | 'ALLOCATION_CREATED';
  title: string;
  description: string;
  user: User;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Filter and Search Types
export interface FilterOptions {
  search?: string;
  employeeId?: string;
  expenseTypeId?: string;
  status?: ClaimStatus | AllocationStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationOptions;
}

// Form Types
export interface ClaimFormData {
  expenseTypeId: string;
  allocationId?: string;
  amount: number;
  description?: string;
  billNumber?: string;
  billDate: string;
  notes?: string;
  files: File[];
}

export interface AllocationFormData {
  employeeId: string;
  expenseTypeId: string;
  amount: number;
  remarks?: string;
  billNumber?: string;
  billDate?: string;
  notes?: string;
  files?: File[];
}

export interface EmployeeFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  reportingManagerId?: string;
  joiningDate?: string;
}

export interface ExpenseTypeFormData {
  name: string;
  description?: string;
  head1?: string;
  head2?: string;
  status: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: PaginationOptions;
}

// Chart and Analytics Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ExpenseTrend {
  month: string;
  amount: number;
  claims: number;
}

export interface EmployeeStats {
  employeeId: string;
  employeeName: string;
  totalClaims: number;
  totalAmount: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
}

// Navigation Types
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: number;
  children?: NavItem[];
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Table Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginationOptions;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  filename?: string;
  data: any[];
  columns?: string[];
  title?: string;
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  sidebarCollapsed: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Success/Error States
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}