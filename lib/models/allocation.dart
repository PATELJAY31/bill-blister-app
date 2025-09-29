enum AllocationStatus { active, inactive, expired }

class Allocation {
  final int id;
  final DateTime allocationDate;
  final int employeeId;
  final int expenseTypeId;
  final double amount;
  final String? remarks;
  final String? billNumber;
  final DateTime? billDate;
  final String? fileUrl;
  final String? notes;
  final AllocationStatus status;
  final String? statusEng;
  final String? notesEng;
  final String? statusHo;
  final String? notesHo;
  final bool originalBill;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Related data
  final String? employeeName;
  final String? expenseTypeName;

  Allocation({
    required this.id,
    required this.allocationDate,
    required this.employeeId,
    required this.expenseTypeId,
    required this.amount,
    this.remarks,
    this.billNumber,
    this.billDate,
    this.fileUrl,
    this.notes,
    required this.status,
    this.statusEng,
    this.notesEng,
    this.statusHo,
    this.notesHo,
    required this.originalBill,
    required this.createdAt,
    required this.updatedAt,
    this.employeeName,
    this.expenseTypeName,
  });

  factory Allocation.fromJson(Map<String, dynamic> json) {
    return Allocation(
      id: json['id'],
      allocationDate: DateTime.parse(json['allocationDate']),
      employeeId: json['employeeId'],
      expenseTypeId: json['expenseTypeId'],
      amount: (json['amount'] as num).toDouble(),
      remarks: json['remarks'],
      billNumber: json['billNumber'],
      billDate: json['billDate'] != null ? DateTime.parse(json['billDate']) : null,
      fileUrl: json['fileUrl'],
      notes: json['notes'],
      status: AllocationStatus.values.firstWhere(
        (e) => e.name.toUpperCase() == json['status'],
        orElse: () => AllocationStatus.active,
      ),
      statusEng: json['statusEng'],
      notesEng: json['notesEng'],
      statusHo: json['statusHo'],
      notesHo: json['notesHo'],
      originalBill: json['originalBill'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      employeeName: json['employee'] != null
          ? '${json['employee']['firstName']} ${json['employee']['lastName']}'
          : null,
      expenseTypeName: json['expenseType']?['name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'allocationDate': allocationDate.toIso8601String().split('T')[0], // YYYY-MM-DD format
      'employeeId': employeeId,
      'expenseTypeId': expenseTypeId,
      'amount': amount,
      'remarks': remarks,
      'billNumber': billNumber,
      'billDate': billDate?.toIso8601String().split('T')[0],
      'fileUrl': fileUrl,
      'notes': notes,
      'status': status.name.toUpperCase(),
      'statusEng': statusEng,
      'notesEng': notesEng,
      'statusHo': statusHo,
      'notesHo': notesHo,
      'originalBill': originalBill,
    };
  }

  // Helper getters
  String get formattedAllocationDate => '${allocationDate.day.toString().padLeft(2, '0')}-${allocationDate.month.toString().padLeft(2, '0')}-${allocationDate.year}';
  String get formattedBillDate => billDate != null 
      ? '${billDate!.day.toString().padLeft(2, '0')}-${billDate!.month.toString().padLeft(2, '0')}-${billDate!.year}'
      : '';
  bool get isActive => status == AllocationStatus.active;
}
