import 'package:flutter/foundation.dart';
import '../models/allocation.dart';
import '../models/employee.dart';
import '../models/expense_type.dart';
import 'allocation_service.dart';

class AllocationState extends ChangeNotifier {
  List<Allocation> _allocations = [];
  List<Employee> _employees = [];
  List<ExpenseType> _expenseTypes = [];
  bool _isLoading = false;
  String? _error;

  // Getters
  List<Allocation> get allocations => _allocations;
  List<Employee> get employees => _employees;
  List<ExpenseType> get expenseTypes => _expenseTypes;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Get active expense types only
  List<ExpenseType> get activeExpenseTypes => 
      _expenseTypes.where((type) => type.isActive).toList();

  // Get active employees only
  List<Employee> get activeEmployees => 
      _employees.where((emp) => emp.isActive).toList();

  // Calculate total amount
  double get totalAmount => 
      _allocations.fold(0.0, (sum, allocation) => sum + allocation.amount);

  // Get allocations by status
  List<Allocation> getActiveAllocations() => 
      _allocations.where((allocation) => allocation.isActive).toList();

  List<Allocation> getInactiveAllocations() => 
      _allocations.where((allocation) => !allocation.isActive).toList();

  // Load all data
  Future<void> loadAllData() async {
    await Future.wait([
      loadAllocations(),
      loadEmployees(),
      loadExpenseTypes(),
    ]);
  }

  // Load allocations
  Future<void> loadAllocations({
    int? employeeId,
    int? expenseTypeId,
    String? status,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await AllocationService.getAllocations(
        employeeId: employeeId,
        expenseTypeId: expenseTypeId,
        status: status,
        startDate: startDate,
        endDate: endDate,
      );

      if (response.success && response.data != null) {
        _allocations = response.data!;
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load allocations');
      }
    } catch (e) {
      _setError('Error loading allocations: ${e.toString()}');
    } finally {
      _setLoading(false);
    }
  }

  // Load employees
  Future<void> loadEmployees() async {
    try {
      final response = await AllocationService.getEmployees();

      if (response.success && response.data != null) {
        _employees = response.data!;
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load employees');
      }
    } catch (e) {
      _setError('Error loading employees: ${e.toString()}');
    }
  }

  // Load expense types
  Future<void> loadExpenseTypes() async {
    try {
      final response = await AllocationService.getExpenseTypes();

      if (response.success && response.data != null) {
        _expenseTypes = response.data!;
        notifyListeners();
      } else {
        _setError(response.error ?? 'Failed to load expense types');
      }
    } catch (e) {
      _setError('Error loading expense types: ${e.toString()}');
    }
  }

  // Create allocation
  Future<bool> createAllocation({
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
    _setLoading(true);
    _clearError();

    try {
      final response = await AllocationService.createAllocation(
        allocationDate: allocationDate,
        employeeId: employeeId,
        expenseTypeId: expenseTypeId,
        amount: amount,
        remarks: remarks,
        billNumber: billNumber,
        billDate: billDate,
        notes: notes,
        statusEng: statusEng,
        notesEng: notesEng,
        statusHo: statusHo,
        notesHo: notesHo,
        originalBill: originalBill,
      );

      if (response.success && response.data != null) {
        _allocations.add(response.data!);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Failed to create allocation');
        return false;
      }
    } catch (e) {
      _setError('Error creating allocation: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Update allocation
  Future<bool> updateAllocation(
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
    _setLoading(true);
    _clearError();

    try {
      final response = await AllocationService.updateAllocation(
        id,
        allocationDate: allocationDate,
        employeeId: employeeId,
        expenseTypeId: expenseTypeId,
        amount: amount,
        remarks: remarks,
        billNumber: billNumber,
        billDate: billDate,
        notes: notes,
        statusEng: statusEng,
        notesEng: notesEng,
        statusHo: statusHo,
        notesHo: notesHo,
        originalBill: originalBill,
      );

      if (response.success && response.data != null) {
        final index = _allocations.indexWhere((a) => a.id == id);
        if (index != -1) {
          _allocations[index] = response.data!;
          notifyListeners();
        }
        return true;
      } else {
        _setError(response.error ?? 'Failed to update allocation');
        return false;
      }
    } catch (e) {
      _setError('Error updating allocation: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Delete allocation
  Future<bool> deleteAllocation(int id) async {
    _setLoading(true);
    _clearError();

    try {
      final response = await AllocationService.deleteAllocation(id);

      if (response.success) {
        _allocations.removeWhere((a) => a.id == id);
        notifyListeners();
        return true;
      } else {
        _setError(response.error ?? 'Failed to delete allocation');
        return false;
      }
    } catch (e) {
      _setError('Error deleting allocation: ${e.toString()}');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }

  // Clear all data
  void clear() {
    _allocations.clear();
    _employees.clear();
    _expenseTypes.clear();
    _isLoading = false;
    _error = null;
    notifyListeners();
  }
}
