export interface Claim {
  id: string;
  employeeName: string;
  expenseType: string;
  lpoNumber?: string;
  billDate: string;
  submittedDate: string;
  billAmount: number;
  engineerStatus: ClaimStatus;
  hoStatus: ClaimStatus;
  receiptPath?: string;
  notes?: string;
}

export interface ReceiptAttachment {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  isImage: boolean;
  file: File;
}

export interface Allocation {
  id: string;
  allocationDate: string;
  employeeName: string;
  expenseType: string;
  lpoNumber?: string;
  cashIssued: number;
  updatedOn: string;
  updatedBy: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface FilterOptions {
  employeeName?: string;
  expenseType?: string;
  status?: ClaimStatus;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ExpenseType {
  id: string;
  name: string;
  icon: string;
}
