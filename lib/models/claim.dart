enum ClaimStatus { pending, approved, rejected }

class Claim {
  final String employeeName;
  final String expenseType;
  final String? lpoNumber;
  final String billDate; // "DD-MM-YYYY"
  final String submittedDate;
  final double billAmount;
  ClaimStatus engineerStatus;
  ClaimStatus hoStatus;
  final String? receiptPath; // local asset/path for preview

  Claim({
    required this.employeeName,
    required this.expenseType,
    this.lpoNumber,
    required this.billDate,
    required this.submittedDate,
    required this.billAmount,
    required this.engineerStatus,
    required this.hoStatus,
    this.receiptPath,
  });
}

Claim mockClaim() {
  return Claim(
    employeeName: 'Saloni Jadav',
    expenseType: 'Food',
    lpoNumber: null,
    billDate: '22-09-2025',
    submittedDate: '22-09-2025',
    billAmount: 100.00,
    engineerStatus: ClaimStatus.pending,
    hoStatus: ClaimStatus.pending,
    receiptPath: null,
  );
}
