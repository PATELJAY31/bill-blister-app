import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import 'um_drawer_header.dart';
import 'um_menu_item.dart';

class UmDrawer extends StatefulWidget {
  const UmDrawer({super.key});

  @override
  State<UmDrawer> createState() => _UmDrawerState();
}

class _UmDrawerState extends State<UmDrawer> {
  final ValueNotifier<int> selected = ValueNotifier<int>(0);

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double width = screenWidth * 0.88;
    final double clamped = width.clamp(320.0, 360.0);

    return Drawer(
      width: clamped,
      child: SafeArea(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UmDrawerHeader(
              onLogout: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Logging out...')),
                );
              },
            ),

            // Welcome + role
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome',
                    style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w700,
                        color: textPrimary),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Admin User',
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: textSecondary),
                  ),
                ],
              ),
            ),

            const Divider(color: divider),

            // Menu items
            ValueListenableBuilder<int>(
              valueListenable: selected,
              builder: (context, index, _) {
                return Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      UmMenuItem(
                        label: 'Amount Allocation',
                        selected: index == 0,
                        onTap: () => _select(context, 0, 'Amount Allocation'),
                      ),
                      UmMenuItem(
                        label: 'Expense Claim',
                        selected: index == 1,
                        onTap: () => _select(context, 1, 'Expense Claim'),
                      ),
                      UmMenuItem(
                        label: 'Claim Verification',
                        selected: index == 2,
                        onTap: () => _select(context, 2, 'Claim Verification'),
                      ),
                      UmMenuItem(
                        label: 'Claim Verification By Ho',
                        selected: index == 3,
                        onTap: () =>
                            _select(context, 3, 'Claim Verification By Ho'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _select(BuildContext context, int value, String label) {
    selected.value = value;
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(label)),
    );
  }
}
