class ExpenseType {
  final int id;
  final String name;
  final String? description;
  final bool status;
  final DateTime createdAt;
  final DateTime updatedAt;

  ExpenseType({
    required this.id,
    required this.name,
    this.description,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ExpenseType.fromJson(Map<String, dynamic> json) {
    return ExpenseType(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      status: json['status'] ?? true,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'status': status,
    };
  }

  // Helper getters
  bool get isActive => status;
}
