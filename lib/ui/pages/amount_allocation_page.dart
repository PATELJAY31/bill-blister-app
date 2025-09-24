import 'package:flutter/material.dart';
import '../shell/app_shell.dart';
import '../../theme/app_theme.dart';

class AmountAllocationPage extends StatefulWidget {
  const AmountAllocationPage({super.key});

  @override
  State<AmountAllocationPage> createState() => _AmountAllocationPageState();
}

class _AmountAllocationPageState extends State<AmountAllocationPage> {
  late List<Allocation> _all; // full list
  late List<Allocation> _visible; // filtered
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    // Mock fetch
    Future.delayed(const Duration(milliseconds: 300), () {
      _all = _mockAllocations();
      _visible = List.of(_all);
      setState(() => _loading = false);
    });
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Amount Allocation',
      body: LayoutBuilder(
        builder: (context, constraints) {
          final width = MediaQuery.of(context).size.width;
          final isCompact = width <= 360;
          final isTablet = width >= 720;
          final outerPadding = EdgeInsets.symmetric(
              horizontal: isCompact ? 12 : 16, vertical: 12);
          final maxCardWidth = 600.0;

          if (_loading) {
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

          final gridCount = isTablet ? 2 : 1;
          final cardSpacing = isCompact ? 12.0 : 16.0;

          final list = SliverPadding(
            padding: outerPadding,
            sliver: SliverGrid(
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: gridCount,
                crossAxisSpacing: cardSpacing,
                mainAxisSpacing: cardSpacing,
                childAspectRatio: isTablet ? 1.4 : 1.15,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final a = _visible[index];
                  return Semantics(
                    label: 'Allocation card for ${a.employeeName}',
                    child: _AllocationCard(allocation: a, compact: isCompact),
                  );
                },
                childCount: _visible.length,
              ),
            ),
          );

          final total =
              _visible.fold<double>(0, (sum, a) => sum + a.cashIssued);

          final totalCard = SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(outerPadding.left, 0,
                  outerPadding.right, outerPadding.bottom + 8),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                    maxWidth: isTablet ? double.infinity : maxCardWidth),
                child: _TotalCard(total: total, isCompact: isCompact),
              ),
            ),
          );

          return CustomScrollView(
            slivers: [list, totalCard],
          );
        },
      ),
    );
  }

  // In a real app this would react to FilterSheet; here we expose a method
  // that could be called after filters are applied.
  void applyFilter({String? employee, String? type}) {
    setState(() {
      _visible = _all.where((a) {
        final okEmployee = employee == null ||
            employee.isEmpty ||
            a.employeeName.toLowerCase().contains(employee.toLowerCase());
        final okType = type == null ||
            type.isEmpty ||
            a.expenseType.toLowerCase().contains(type.toLowerCase());
        return okEmployee && okType;
      }).toList();
    });
  }
}

class _AllocationCard extends StatelessWidget {
  final Allocation allocation;
  final bool compact;
  final VoidCallback? onTap;

  const _AllocationCard({
    required this.allocation, 
    this.compact = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            color: surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: borderLight),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header with gradient
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(compact ? 16 : 20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      navy.withOpacity(0.05),
                      navyLight.withOpacity(0.02),
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      allocation.employeeName,
                      style: TextStyle(
                        fontSize: compact ? 16 : 18,
                        fontWeight: FontWeight.w700,
                        color: textPrimary,
                        letterSpacing: 0.1,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      allocation.expenseType,
                      style: TextStyle(
                        fontSize: compact ? 12 : 14,
                        fontWeight: FontWeight.w500,
                        color: textSecondary,
                        letterSpacing: 0.1,
                      ),
                    ),
                  ],
                ),
              ),
              
              // Content
              Padding(
                padding: EdgeInsets.all(compact ? 16 : 20),
                child: Column(
                  children: [
                    _kv('Allocation Date', _fmtDate(allocation.allocationDate)),
                    _kv('LPO Number', allocation.lpoNumber?.isNotEmpty == true
                        ? allocation.lpoNumber! : '—'),
                    _kv('Cash Issued', _fmtAmount(allocation.cashIssued)),
                    _kv('Updated On', _fmtTimestamp(allocation.updatedOn)),
                    _kv('Updated By', allocation.updatedBy,
                        valueStyle: allocation.updatedBy.toUpperCase() == 'ADMIN USER'
                            ? TextStyle(
                                fontSize: compact ? 13 : 14,
                                fontWeight: FontWeight.w700,
                                color: navy,
                                letterSpacing: 0.3,
                              )
                            : null),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _kv(String label, String value, {TextStyle? valueStyle}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: compact ? 100 : 120,
            child: Text(
              label,
              style: TextStyle(
                fontSize: compact ? 13 : 14,
                fontWeight: FontWeight.w600,
                color: textSecondary,
                letterSpacing: 0.1,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: valueStyle ?? TextStyle(
                fontSize: compact ? 13 : 14,
                fontWeight: FontWeight.w500,
                color: textPrimary,
                letterSpacing: 0.1,
              ),
              softWrap: true,
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  String _fmtDate(DateTime d) {
    final mm = d.month.toString().padLeft(2, '0');
    final dd = d.day.toString().padLeft(2, '0');
    final yy = d.year.toString();
    return '$mm-$dd-$yy';
  }

  String _fmtTimestamp(DateTime d) {
    final y = d.year.toString().padLeft(4, '0');
    final mo = d.month.toString().padLeft(2, '0');
    final da = d.day.toString().padLeft(2, '0');
    final h = d.hour.toString().padLeft(2, '0');
    final mi = d.minute.toString().padLeft(2, '0');
    final s = d.second.toString().padLeft(2, '0');
    return '$y-$mo-$da $h:$mi:$s';
  }

  String _fmtAmount(double v) {
    return v.toStringAsFixed(2);
  }
}

class _TotalCard extends StatelessWidget {
  final double total;
  final bool isCompact;
  
  const _TotalCard({
    required this.total,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [navy, navyLight],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: navy.withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      padding: EdgeInsets.all(isCompact ? 20 : 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.account_balance_wallet_rounded,
                color: onNavy,
                size: isCompact ? 20 : 24,
              ),
              const SizedBox(width: 8),
              Text(
                'Total Cash Issued',
                style: TextStyle(
                  fontSize: isCompact ? 16 : 18,
                  fontWeight: FontWeight.w700,
                  color: onNavy,
                  letterSpacing: 0.1,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Amount',
                  style: TextStyle(
                    fontSize: isCompact ? 14 : 16,
                    color: onNavySecondary,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.1,
                  ),
                ),
              ),
              Text(
                '₹${total.toStringAsFixed(2)}',
                style: TextStyle(
                  fontSize: isCompact ? 20 : 24,
                  fontWeight: FontWeight.w800,
                  color: onNavy,
                  letterSpacing: 0.1,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class Allocation {
  final DateTime allocationDate;
  final String employeeName;
  final String expenseType;
  final String? lpoNumber;
  final double cashIssued;
  final DateTime updatedOn;
  final String updatedBy;

  Allocation({
    required this.allocationDate,
    required this.employeeName,
    required this.expenseType,
    required this.lpoNumber,
    required this.cashIssued,
    required this.updatedOn,
    required this.updatedBy,
  });
}

List<Allocation> _mockAllocations() {
  final now = DateTime.now();
  return [
    Allocation(
      allocationDate: now.subtract(const Duration(days: 2)),
      employeeName: 'Saloni Jadav',
      expenseType: 'Food',
      lpoNumber: null,
      cashIssued: 100.00,
      updatedOn: now.subtract(const Duration(hours: 5)),
      updatedBy: 'ADMIN USER',
    ),
    Allocation(
      allocationDate: now.subtract(const Duration(days: 10)),
      employeeName: 'Nehal',
      expenseType: 'Travel',
      lpoNumber: 'LPO-0031',
      cashIssued: 450.50,
      updatedOn: now.subtract(const Duration(days: 1, hours: 2)),
      updatedBy: 'Manager',
    ),
    Allocation(
      allocationDate: now,
      employeeName: 'Aarav',
      expenseType: 'Supplies',
      lpoNumber: '',
      cashIssued: 20.0,
      updatedOn: now.subtract(const Duration(minutes: 30)),
      updatedBy: 'Accounts',
    ),
  ];
}
