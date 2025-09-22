import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../widgets/app_drawer.dart';
import '../../utils/constants.dart';
import '../widgets/empty_state.dart';
import '../widgets/icon_badge.dart';

class AmountAllocationPage extends StatefulWidget {
  const AmountAllocationPage({super.key});

  @override
  State<AmountAllocationPage> createState() => _AmountAllocationPageState();
}

class _AmountAllocationPageState extends State<AmountAllocationPage> {
  int notificationCount = 0; // Badge will be hidden when count is 0
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      drawer: const AppDrawer(),
      appBar: _buildCustomNavyAppBar(),
      body: RefreshIndicator(
        onRefresh: _handleRefresh,
        child: SingleChildScrollView(
          physics: AlwaysScrollableScrollPhysics(),
          child: SizedBox(
            height: 600, // Ensure scrollable content for RefreshIndicator
            child: EmptyState(
              icon: Icons.data_array_outlined,
              title: 'No Data Found',
              subtitle: 'Try adding an allocation or adjusting filters.',
              primaryActionText: 'Add Allocation',
              secondaryActionText: 'Filter',
              onPrimaryAction: () => _showAddAllocationSnackBar(),
              onSecondaryAction: () => _showFilterSnackBar(),
            ),
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildCustomNavyAppBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(72),
      child: Container(
        height: 72,
        decoration: const BoxDecoration(
          color: navy,
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(12),
            bottomRight: Radius.circular(12),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 12,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Leading hamburger menu
              IconButton(
                onPressed: () {
                  _scaffoldKey.currentState?.openDrawer();
                },
                icon: const Icon(
                  Icons.menu_rounded,
                  color: Colors.white,
                  size: 24,
                ),
              ),

              // Centered title
              Expanded(
                child: Text(
                  'Amount Allocation | $companyName',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.3,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),

              // Right actions
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Notifications with badge
                  IconButton(
                    onPressed: _showNotificationsSnackBar,
                    icon: IconBadge(
                      count: notificationCount,
                      child: const Icon(
                        Icons.notifications_none_rounded,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  ),

                  // Add button
                  IconButton(
                    onPressed: _showAddAllocationSnackBar,
                    icon: const Icon(
                      Icons.add_rounded,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),

                  // Filter button
                  IconButton(
                    onPressed: _showFilterSnackBar,
                    icon: const Icon(
                      Icons.tune_rounded,
                      color: Colors.white,
                      size: 24,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleRefresh() async {
    // Simulate refresh delay
    await Future.delayed(const Duration(seconds: 1));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Refreshed'),
          duration: Duration(seconds: 1),
        ),
      );
    }
  }

  void _showNotificationsSnackBar() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Notifications - Coming soon'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showAddAllocationSnackBar() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Add Allocation - Coming soon'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showFilterSnackBar() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Filter - Coming soon'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}
