import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../shell/app_shell.dart';
import '../../theme/app_theme.dart';
import '../../services/allocation_state.dart';
import '../../models/allocation.dart';

class AmountAllocationPage extends StatefulWidget {
  const AmountAllocationPage({super.key});

  @override
  State<AmountAllocationPage> createState() => _AmountAllocationPageState();
}

class _AmountAllocationPageState extends State<AmountAllocationPage> {
  List<Allocation> _visible = []; // filtered list
  String _searchQuery = '';
  String _selectedStatus = 'All';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final allocationState = Provider.of<AllocationState>(context, listen: false);
    await allocationState.loadAllData();
    _applyFilters();
  }

  void _applyFilters() {
    final allocationState = Provider.of<AllocationState>(context, listen: false);
    List<Allocation> filtered = List.from(allocationState.allocations);

    // Apply search filter
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((allocation) {
        final employeeName = allocation.employeeName?.toLowerCase() ?? '';
        final expenseType = allocation.expenseTypeName?.toLowerCase() ?? '';
        final query = _searchQuery.toLowerCase();
        return employeeName.contains(query) || expenseType.contains(query);
      }).toList();
    }

    // Apply status filter
    if (_selectedStatus != 'All') {
      filtered = filtered.where((allocation) {
        switch (_selectedStatus) {
          case 'Active':
            return allocation.isActive;
          case 'Inactive':
            return !allocation.isActive;
          default:
            return true;
        }
      }).toList();
    }

    setState(() {
      _visible = filtered;
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Amount Allocation',
      body: Consumer<AllocationState>(
        builder: (context, allocationState, child) {
          return LayoutBuilder(
            builder: (context, constraints) {
              final width = MediaQuery.of(context).size.width;
              final isCompact = width <= 360;
              final isTablet = width >= 720;
              final outerPadding = EdgeInsets.symmetric(
                  horizontal: isCompact ? 12 : 16, vertical: 12);
              final maxCardWidth = 600.0;

              if (allocationState.isLoading) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 48),
                    child: Column(
                      children: [
                        const CircularProgressIndicator(),
                        const SizedBox(height: 12),
                        Text('Loading allocations...',
                            style: TextStyle(
                            color: textSecondary,
                            fontSize: isCompact ? 15 : 16)),
                      ],
                    ),
                  ),
                );
              }

              if (allocationState.error != null) {
                return Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.error_outline,
                          size: 64,
                          color: error,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Error loading allocations',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: textPrimary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          allocationState.error!,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: textSecondary,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: _loadData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  ),
                );
              }

              if (_visible.isEmpty) {
                return Center(
                  child: Padding(
                    padding: outerPadding,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.inbox_outlined, size: 64, color: muted),
                        SizedBox(height: 12),
                        Text('No allocations found for selected filter'),
                      ],
                    ),
                  ),
                );
              }

              // Calculate total amount from visible allocations
              final totalAmount = _visible.fold(0.0, (sum, allocation) => sum + allocation.amount);

              return SingleChildScrollView(
                child: Padding(
                  padding: outerPadding,
                  child: Center(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: maxCardWidth),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Search and Filter Section
                          _buildSearchAndFilterSection(isCompact),
                          const SizedBox(height: 16),
                          
                          // Total Amount Card
                          _buildTotalAmountCard(totalAmount, isCompact),
                          const SizedBox(height: 16),
                          
                          // Allocations List
                          _buildAllocationsList(isCompact, isTablet),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildSearchAndFilterSection(bool isCompact) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Search Field
            TextField(
              decoration: const InputDecoration(
                hintText: 'Search by employee or expense type...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(),
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
                _applyFilters();
              },
            ),
            const SizedBox(height: 12),
            
            // Status Filter
            Row(
              children: [
                const Text('Status:', style: TextStyle(fontWeight: FontWeight.w500)),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButton<String>(
                    value: _selectedStatus,
                    isExpanded: true,
                    items: ['All', 'Active', 'Inactive'].map((status) {
                      return DropdownMenuItem(
                        value: status,
                        child: Text(status),
                      );
                    }).toList(),
                    onChanged: (value) {
                      setState(() {
                        _selectedStatus = value!;
                      });
                      _applyFilters();
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTotalAmountCard(double totalAmount, bool isCompact) {
    return Card(
      color: navy,
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Icon(
              Icons.account_balance_wallet,
              color: Colors.white,
              size: isCompact ? 24 : 28,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Total Cash Issued',
                    style: TextStyle(
                      color: onNavySecondary,
                      fontSize: isCompact ? 14 : 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₹${totalAmount.toStringAsFixed(2)}',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: isCompact ? 20 : 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAllocationsList(bool isCompact, bool isTablet) {
    return Column(
      children: _visible.map((allocation) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Card(
            child: InkWell(
              onTap: () {
                // TODO: Navigate to allocation details
              },
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            allocation.employeeName ?? 'Unknown Employee',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: isCompact ? 14 : 16,
                              color: textPrimary,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: allocation.isActive ? successLight : errorLight,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            allocation.isActive ? 'Active' : 'Inactive',
                            style: TextStyle(
                              color: allocation.isActive ? success : error,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      allocation.expenseTypeName ?? 'Unknown Type',
                      style: TextStyle(
                        color: textSecondary,
                        fontSize: isCompact ? 13 : 14,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '₹${allocation.amount.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: isCompact ? 16 : 18,
                            color: navy,
                          ),
                        ),
                        Text(
                          allocation.formattedAllocationDate,
                          style: TextStyle(
                            color: textTertiary,
                            fontSize: isCompact ? 12 : 13,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}