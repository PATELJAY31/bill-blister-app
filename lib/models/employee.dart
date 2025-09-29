enum UserRole { employee, engineer, hoApprover, admin }

class Employee {
  final int id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final UserRole role;
  final int? reportingManagerId;
  final String passwordHash;
  final String loginName;
  final DateTime? dob;
  final String status;
  final String? head1;
  final String? head2;
  final DateTime? joiningDate;
  final DateTime? leavingDate;
  final String? country;
  final String? state;
  final String? city;
  final String? fullAddress1;
  final String? fullAddress2;
  final DateTime createdAt;
  final DateTime updatedAt;

  // Related data
  final String? reportingManagerName;

  Employee({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phone,
    required this.role,
    this.reportingManagerId,
    required this.passwordHash,
    required this.loginName,
    this.dob,
    required this.status,
    this.head1,
    this.head2,
    this.joiningDate,
    this.leavingDate,
    this.country,
    this.state,
    this.city,
    this.fullAddress1,
    this.fullAddress2,
    required this.createdAt,
    required this.updatedAt,
    this.reportingManagerName,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      email: json['email'],
      phone: json['phone'],
      role: UserRole.values.firstWhere(
        (e) => e.name.toUpperCase() == json['role'].toString().replaceAll('_', ''),
        orElse: () => UserRole.employee,
      ),
      reportingManagerId: json['reportingManagerId'],
      passwordHash: json['passwordHash'],
      loginName: json['loginName'],
      dob: json['dob'] != null ? DateTime.parse(json['dob']) : null,
      status: json['status'],
      head1: json['head1'],
      head2: json['head2'],
      joiningDate: json['joiningDate'] != null ? DateTime.parse(json['joiningDate']) : null,
      leavingDate: json['leavingDate'] != null ? DateTime.parse(json['leavingDate']) : null,
      country: json['country'],
      state: json['state'],
      city: json['city'],
      fullAddress1: json['fullAddress1'],
      fullAddress2: json['fullAddress2'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      reportingManagerName: json['reportingManager'] != null
          ? '${json['reportingManager']['firstName']} ${json['reportingManager']['lastName']}'
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      'role': role.name.toUpperCase(),
      'reportingManagerId': reportingManagerId,
      'loginName': loginName,
      'dob': dob?.toIso8601String().split('T')[0],
      'status': status,
      'head1': head1,
      'head2': head2,
      'joiningDate': joiningDate?.toIso8601String().split('T')[0],
      'leavingDate': leavingDate?.toIso8601String().split('T')[0],
      'country': country,
      'state': state,
      'city': city,
      'fullAddress1': fullAddress1,
      'fullAddress2': fullAddress2,
    };
  }

  // Helper getters
  String get fullName => '$firstName $lastName';
  bool get isActive => status == 'ACTIVE';
  String get roleDisplayName {
    switch (role) {
      case UserRole.employee:
        return 'Employee';
      case UserRole.engineer:
        return 'Engineer';
      case UserRole.hoApprover:
        return 'HO Approver';
      case UserRole.admin:
        return 'Admin';
    }
  }
}
