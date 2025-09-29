enum ClaimStatus { pending, approved, rejected }

class Claim {
  final int id;
  final int employeeId;
  final int expenseTypeId;
  final int? allocationId;
  final double amount;
  final String? description;
  final String? billNumber;
  final DateTime billDate;
  final String? fileUrl;
  final String? notes;
  final ClaimStatus status;
  final int? verifiedById;
  final DateTime? verifiedAt;
  final String? verifiedNotes;
  final int? approvedById;
  final DateTime? approvedAt;
  final String? approvedNotes;
  final String? rejectionReason;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Related data
  final String? employeeName;
  final String? expenseTypeName;
  final String? verifiedByName;
  final String? approvedByName;

  Claim({
    required this.id,
    required this.employeeId,
    required this.expenseTypeId,
    this.allocationId,
    required this.amount,
    this.description,
    this.billNumber,
    required this.billDate,
    this.fileUrl,
    this.notes,
    required this.status,
    this.verifiedById,
    this.verifiedAt,
    this.verifiedNotes,
    this.approvedById,
    this.approvedAt,
    this.approvedNotes,
    this.rejectionReason,
    required this.createdAt,
    required this.updatedAt,
    this.employeeName,
    this.expenseTypeName,
    this.verifiedByName,
    this.approvedByName,
  });

  factory Claim.fromJson(Map<String, dynamic> json) {
    return Claim(
      id: json['id'],
      employeeId: json['employeeId'],
      expenseTypeId: json['expenseTypeId'],
      allocationId: json['allocationId'],
      amount: (json['amount'] as num).toDouble(),
      description: json['description'],
      billNumber: json['billNumber'],
      billDate: DateTime.parse(json['billDate']),
      fileUrl: json['fileUrl'],
      notes: json['notes'],
      status: ClaimStatus.values.firstWhere(
        (e) => e.name.toUpperCase() == json['status'],
        orElse: () => ClaimStatus.pending,
      ),
      verifiedById: json['verifiedById'],
      verifiedAt: json['verifiedAt'] != null ? DateTime.parse(json['verifiedAt']) : null,
      verifiedNotes: json['verifiedNotes'],
      approvedById: json['approvedById'],
      approvedAt: json['approvedAt'] != null ? DateTime.parse(json['approvedAt']) : null,
      approvedNotes: json['approvedNotes'],
      rejectionReason: json['rejectionReason'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      employeeName: json['employee']?['firstName'] != null && json['employee']?['lastName'] != null
          ? '${json['employee']['firstName']} ${json['employee']['lastName']}'
          : null,
      expenseTypeName: json['expenseType']?['name'],
      verifiedByName: json['verifiedBy'] != null
          ? '${json['verifiedBy']['firstName']} ${json['verifiedBy']['lastName']}'
          : null,
      approvedByName: json['approvedBy'] != null
          ? '${json['approvedBy']['firstName']} ${json['approvedBy']['lastName']}'
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeId': employeeId,
      'expenseTypeId': expenseTypeId,
      'allocationId': allocationId,
      'amount': amount,
      'description': description,
      'billNumber': billNumber,
      'billDate': billDate.toIso8601String().split('T')[0], // YYYY-MM-DD format
      'fileUrl': fileUrl,
      'notes': notes,
      'status': status.name.toUpperCase(),
      'verifiedById': verifiedById,
      'verifiedAt': verifiedAt?.toIso8601String(),
      'verifiedNotes': verifiedNotes,
      'approvedById': approvedById,
      'approvedAt': approvedAt?.toIso8601String(),
      'approvedNotes': approvedNotes,
      'rejectionReason': rejectionReason,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  // Helper getters for UI
  String get formattedBillDate => '${billDate.day.toString().padLeft(2, '0')}-${billDate.month.toString().padLeft(2, '0')}-${billDate.year}';
  String get formattedSubmittedDate => '${createdAt.day.toString().padLeft(2, '0')}-${createdAt.month.toString().padLeft(2, '0')}-${createdAt.year}';
  
  ClaimStatus get engineerStatus => status;
  ClaimStatus get hoStatus => status;
}

// Mock data for development
Claim mockClaim() {
  return Claim(
    id: 1,
    employeeId: 1,
    expenseTypeId: 1,
    amount: 100.00,
    billDate: DateTime(2025, 9, 22),
    status: ClaimStatus.pending,
    createdAt: DateTime(2025, 9, 22),
    updatedAt: DateTime(2025, 9, 22),
    employeeName: 'Saloni Jadav',
    expenseTypeName: 'Food',
  );
}
