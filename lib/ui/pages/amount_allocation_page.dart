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
                child: _TotalCard(total: total),
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

  const _AllocationCard({required this.allocation, this.compact = false});

  TextStyle get _labelStyle => TextStyle(
        fontSize: compact ? 15 : 16,
        fontWeight: FontWeight.w700,
        color: const Color(0xFF111827),
      );

  TextStyle get _valueStyle => TextStyle(
        fontSize: compact ? 15 : 16,
        fontWeight: FontWeight.w500,
        color: const Color(0xFF374151),
      );

  @override
  Widget build(BuildContext context) {
    final rows = <Widget>[
      _kv('Allocation Date', _fmtDate(allocation.allocationDate)),
      _kv('Employee Name', allocation.employeeName),
      _kv('Expense Type', allocation.expenseType),
      _kv(
          'LPO Number',
          allocation.lpoNumber?.isNotEmpty == true
              ? allocation.lpoNumber!
              : '—'),
      _kv('Cash Issued', _fmtAmount(allocation.cashIssued)),
      _kv('Updated On', _fmtTimestamp(allocation.updatedOn)),
      _kv('Updated By', allocation.updatedBy,
          valueStyle: allocation.updatedBy.toUpperCase() == 'ADMIN USER'
              ? _valueStyle.copyWith(
                  fontWeight: FontWeight.w700, letterSpacing: .3)
              : _valueStyle),
    ];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF1F2F4),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: divider),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: rows
            .expand((w) => [w, const SizedBox(height: 10)])
            .toList()
            .sublist(0, rows.length * 2 - 1),
      ),
    );
  }

  Widget _kv(String label, String value, {TextStyle? valueStyle}) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 150,
          child: Text(label, style: _labelStyle),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            style: valueStyle ?? _valueStyle,
            softWrap: true,
          ),
        ),
      ],
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
  const _TotalCard({required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: navy,
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Total',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: onNavy,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: const [
              Expanded(
                child: Text('Cash Issued',
                    style:
                        TextStyle(color: onNavy, fontWeight: FontWeight.w600)),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            total.toStringAsFixed(2),
            style: const TextStyle(
              color: onNavy,
              fontWeight: FontWeight.w700,
              fontSize: 18,
            ),
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
