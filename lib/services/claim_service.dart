import 'dart:io';
import '../models/claim.dart';
import '../models/employee.dart';
import '../models/expense_type.dart';
import 'api_client.dart';

class ClaimService {
  // Get all claims
  static Future<ApiResponse<List<Claim>>> getClaims({
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
      '/claims',
      queryParams: queryParams,
    );

    if (response.success && response.data != null) {
      final claims = response.data!
          .map((json) => Claim.fromJson(json))
          .toList();
      return ApiResponse<List<Claim>>.success(claims);
    } else {
      return ApiResponse<List<Claim>>.error(response.error ?? 'Failed to fetch claims');
    }
  }

  // Get claim by ID
  static Future<ApiResponse<Claim>> getClaim(int id) async {
    final response = await ApiClient.get<Map<String, dynamic>>(
      '/claims/$id',
    );

    if (response.success && response.data != null) {
      final claim = Claim.fromJson(response.data!);
      return ApiResponse<Claim>.success(claim);
    } else {
      return ApiResponse<Claim>.error(response.error ?? 'Failed to fetch claim');
    }
  }

  // Create new claim
  static Future<ApiResponse<Claim>> createClaim({
    required int employeeId,
    required int expenseTypeId,
    int? allocationId,
    required double amount,
    String? description,
    String? billNumber,
    required DateTime billDate,
    String? notes,
    File? receiptFile,
  }) async {
    try {
      if (receiptFile != null) {
        // Upload file first
        final uploadResponse = await ApiClient.uploadFile<Map<String, dynamic>>(
          '/claims/upload',
          receiptFile,
          fieldName: 'receipt',
          additionalFields: {
            'employeeId': employeeId.toString(),
            'expenseTypeId': expenseTypeId.toString(),
            'amount': amount.toString(),
            'billDate': billDate.toIso8601String().split('T')[0],
            if (allocationId != null) 'allocationId': allocationId.toString(),
            if (description != null) 'description': description,
            if (billNumber != null) 'billNumber': billNumber,
            if (notes != null) 'notes': notes,
          },
        );

        if (!uploadResponse.success) {
          return ApiResponse<Claim>.error(uploadResponse.error ?? 'File upload failed');
        }

        final claim = Claim.fromJson(uploadResponse.data!);
        return ApiResponse<Claim>.success(claim);
      } else {
        // Create claim without file
        final response = await ApiClient.post<Map<String, dynamic>>(
          '/claims',
          body: {
            'employeeId': employeeId,
            'expenseTypeId': expenseTypeId,
            if (allocationId != null) 'allocationId': allocationId,
            'amount': amount,
            if (description != null) 'description': description,
            if (billNumber != null) 'billNumber': billNumber,
            'billDate': billDate.toIso8601String().split('T')[0],
            if (notes != null) 'notes': notes,
          },
        );

        if (response.success && response.data != null) {
          final claim = Claim.fromJson(response.data!);
          return ApiResponse<Claim>.success(claim);
        } else {
          return ApiResponse<Claim>.error(response.error ?? 'Failed to create claim');
        }
      }
    } catch (e) {
      return ApiResponse<Claim>.error('Error creating claim: ${e.toString()}');
    }
  }

  // Update claim
  static Future<ApiResponse<Claim>> updateClaim(
    int id, {
    int? employeeId,
    int? expenseTypeId,
    int? allocationId,
    double? amount,
    String? description,
    String? billNumber,
    DateTime? billDate,
    String? notes,
    File? receiptFile,
  }) async {
    try {
      final body = <String, dynamic>{};
      
      if (employeeId != null) body['employeeId'] = employeeId;
      if (expenseTypeId != null) body['expenseTypeId'] = expenseTypeId;
      if (allocationId != null) body['allocationId'] = allocationId;
      if (amount != null) body['amount'] = amount;
      if (description != null) body['description'] = description;
      if (billNumber != null) body['billNumber'] = billNumber;
      if (billDate != null) body['billDate'] = billDate.toIso8601String().split('T')[0];
      if (notes != null) body['notes'] = notes;

      if (receiptFile != null) {
        // Upload new file
        final uploadResponse = await ApiClient.uploadFile<Map<String, dynamic>>(
          '/claims/$id/upload',
          receiptFile,
          fieldName: 'receipt',
          additionalFields: body,
        );

        if (!uploadResponse.success) {
          return ApiResponse<Claim>.error(uploadResponse.error ?? 'File upload failed');
        }

        final claim = Claim.fromJson(uploadResponse.data!);
        return ApiResponse<Claim>.success(claim);
      } else {
        // Update without file
        final response = await ApiClient.put<Map<String, dynamic>>(
          '/claims/$id',
          body: body,
        );

        if (response.success && response.data != null) {
          final claim = Claim.fromJson(response.data!);
          return ApiResponse<Claim>.success(claim);
        } else {
          return ApiResponse<Claim>.error(response.error ?? 'Failed to update claim');
        }
      }
    } catch (e) {
      return ApiResponse<Claim>.error('Error updating claim: ${e.toString()}');
    }
  }

  // Verify claim (Engineer)
  static Future<ApiResponse<Claim>> verifyClaim(
    int id, {
    required bool approved,
    String? notes,
    String? rejectionReason,
  }) async {
    final response = await ApiClient.post<Map<String, dynamic>>(
      '/claims/$id/verify',
      body: {
        'approved': approved,
        if (notes != null) 'notes': notes,
        if (rejectionReason != null) 'rejectionReason': rejectionReason,
      },
    );

    if (response.success && response.data != null) {
      final claim = Claim.fromJson(response.data!);
      return ApiResponse<Claim>.success(claim);
    } else {
      return ApiResponse<Claim>.error(response.error ?? 'Failed to verify claim');
    }
  }

  // Approve claim (HO Approver)
  static Future<ApiResponse<Claim>> approveClaim(
    int id, {
    required bool approved,
    String? notes,
    String? rejectionReason,
  }) async {
    final response = await ApiClient.post<Map<String, dynamic>>(
      '/claims/$id/approve',
      body: {
        'approved': approved,
        if (notes != null) 'notes': notes,
        if (rejectionReason != null) 'rejectionReason': rejectionReason,
      },
    );

    if (response.success && response.data != null) {
      final claim = Claim.fromJson(response.data!);
      return ApiResponse<Claim>.success(claim);
    } else {
      return ApiResponse<Claim>.error(response.error ?? 'Failed to approve claim');
    }
  }

  // Delete claim
  static Future<ApiResponse<void>> deleteClaim(int id) async {
    final response = await ApiClient.delete<void>('/claims/$id');

    if (response.success) {
      return ApiResponse<void>.success(null);
    } else {
      return ApiResponse<void>.error(response.error ?? 'Failed to delete claim');
    }
  }

  // Get employees for claim
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

  // Get expense types for claim
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
