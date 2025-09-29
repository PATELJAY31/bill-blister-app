import '../models/allocation.dart';
import '../models/employee.dart';
import '../models/expense_type.dart';
import 'api_client.dart';

class AllocationService {
  // Get all allocations
  static Future<ApiResponse<List<Allocation>>> getAllocations({
    int? employeeId,
    int? expenseTypeId,
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, String>{};
    
    if (employeeId != null) queryParams['employeeId'] = employeeId.toString();
    if (expenseTypeId != null) queryParams['expenseTypeId'] = expenseTypeId.toString();
    if (status != null) queryParams['status'] = status;
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String().split('T')[0];
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String().split('T')[0];

    final response = await ApiClient.get<List<dynamic>>(
      '/allocations',
      queryParams: queryParams,
    );

    if (response.success && response.data != null) {
      final allocations = response.data!
          .map((json) => Allocation.fromJson(json))
          .toList();
      return ApiResponse<List<Allocation>>.success(allocations);
    } else {
      return ApiResponse<List<Allocation>>.error(response.error ?? 'Failed to fetch allocations');
    }
  }

  // Get allocation by ID
  static Future<ApiResponse<Allocation>> getAllocation(int id) async {
    final response = await ApiClient.get<Map<String, dynamic>>(
      '/allocations/$id',
    );

    if (response.success && response.data != null) {
      final allocation = Allocation.fromJson(response.data!);
      return ApiResponse<Allocation>.success(allocation);
    } else {
      return ApiResponse<Allocation>.error(response.error ?? 'Failed to fetch allocation');
    }
  }

  // Create new allocation
  static Future<ApiResponse<Allocation>> createAllocation({
    required DateTime allocationDate,
    required int employeeId,
    required int expenseTypeId,
    required double amount,
    String? remarks,
    String? billNumber,
    DateTime? billDate,
    String? notes,
    String? statusEng,
    String? notesEng,
    String? statusHo,
    String? notesHo,
    bool originalBill = false,
  }) async {
    final response = await ApiClient.post<Map<String, dynamic>>(
      '/allocations',
      body: {
        'allocationDate': allocationDate.toIso8601String().split('T')[0],
        'employeeId': employeeId,
        'expenseTypeId': expenseTypeId,
        'amount': amount,
        if (remarks != null) 'remarks': remarks,
        if (billNumber != null) 'billNumber': billNumber,
        if (billDate != null) 'billDate': billDate.toIso8601String().split('T')[0],
        if (notes != null) 'notes': notes,
        if (statusEng != null) 'statusEng': statusEng,
        if (notesEng != null) 'notesEng': notesEng,
        if (statusHo != null) 'statusHo': statusHo,
        if (notesHo != null) 'notesHo': notesHo,
        'originalBill': originalBill,
      },
    );

    if (response.success && response.data != null) {
      final allocation = Allocation.fromJson(response.data!);
      return ApiResponse<Allocation>.success(allocation);
    } else {
      return ApiResponse<Allocation>.error(response.error ?? 'Failed to create allocation');
    }
  }

  // Update allocation
  static Future<ApiResponse<Allocation>> updateAllocation(
    int id, {
    DateTime? allocationDate,
    int? employeeId,
    int? expenseTypeId,
    double? amount,
    String? remarks,
    String? billNumber,
    DateTime? billDate,
    String? notes,
    String? statusEng,
    String? notesEng,
    String? statusHo,
    String? notesHo,
    bool? originalBill,
  }) async {
    final body = <String, dynamic>{};
    
    if (allocationDate != null) body['allocationDate'] = allocationDate.toIso8601String().split('T')[0];
    if (employeeId != null) body['employeeId'] = employeeId;
    if (expenseTypeId != null) body['expenseTypeId'] = expenseTypeId;
    if (amount != null) body['amount'] = amount;
    if (remarks != null) body['remarks'] = remarks;
    if (billNumber != null) body['billNumber'] = billNumber;
    if (billDate != null) body['billDate'] = billDate.toIso8601String().split('T')[0];
    if (notes != null) body['notes'] = notes;
    if (statusEng != null) body['statusEng'] = statusEng;
    if (notesEng != null) body['notesEng'] = notesEng;
    if (statusHo != null) body['statusHo'] = statusHo;
    if (notesHo != null) body['notesHo'] = notesHo;
    if (originalBill != null) body['originalBill'] = originalBill;

    final response = await ApiClient.put<Map<String, dynamic>>(
      '/allocations/$id',
      body: body,
    );

    if (response.success && response.data != null) {
      final allocation = Allocation.fromJson(response.data!);
      return ApiResponse<Allocation>.success(allocation);
    } else {
      return ApiResponse<Allocation>.error(response.error ?? 'Failed to update allocation');
    }
  }

  // Delete allocation
  static Future<ApiResponse<void>> deleteAllocation(int id) async {
    final response = await ApiClient.delete<void>('/allocations/$id');

    if (response.success) {
      return ApiResponse<void>.success(null);
    } else {
      return ApiResponse<void>.error(response.error ?? 'Failed to delete allocation');
    }
  }

  // Get employees for allocation
  static Future<ApiResponse<List<Employee>>> getEmployees() async {
    final response = await ApiClient.get<List<dynamic>>('/employees');

    if (response.success && response.data != null) {
      final employees = response.data!
          .map((json) => Employee.fromJson(json))
          .toList();
      return ApiResponse<List<Employee>>.success(employees);
    } else {
      return ApiResponse<List<Employee>>.error(response.error ?? 'Failed to fetch employees');
    }
  }

  // Get expense types for allocation
  static Future<ApiResponse<List<ExpenseType>>> getExpenseTypes() async {
    final response = await ApiClient.get<List<dynamic>>('/expense-types');

    if (response.success && response.data != null) {
      final expenseTypes = response.data!
          .map((json) => ExpenseType.fromJson(json))
          .toList();
      return ApiResponse<List<ExpenseType>>.success(expenseTypes);
    } else {
      return ApiResponse<List<ExpenseType>>.error(response.error ?? 'Failed to fetch expense types');
    }
  }
}
