import 'package:flutter/material.dart';
import '../shell/app_shell.dart';
import '../widgets/empty_state.dart';

class ClaimApprovalPage extends StatelessWidget {
  const ClaimApprovalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Claim Approval',
      body: EmptyState(
        icon: Icons.approval_outlined,
        title: 'No Claims to Approve',
        subtitle: 'Claims will appear here when ready for approval.',
        primaryActionText: 'View Pending',
        secondaryActionText: 'Refresh',
        onPrimaryAction: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('View Pending Claims - Coming soon'),
              duration: Duration(seconds: 2),
            ),
          );
        },
        onSecondaryAction: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Refreshed'),
              duration: Duration(seconds: 1),
            ),
          );
        },
      ),
    );
  }
}
