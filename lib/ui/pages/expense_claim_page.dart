import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../shell/app_shell.dart';
import '../widgets/info_row.dart';

class ExpenseClaimPage extends StatelessWidget {
  const ExpenseClaimPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Expense Claim',
      onPlusPressed: () {
        Navigator.pushNamed(context, '/expense-claim/new');
      },
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Claim Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: surface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: divider),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  InfoRow(
                    label: 'Expense Type',
                    value: 'Conference & trade show registration',
                  ),
                  InfoRow(
                    label: 'LPO Number',
                    value: '',
                  ),
                  InfoRow(
                    label: 'Cash Received',
                    value: '0.00',
                  ),
                  InfoRow(
                    label: 'Bill uploaded',
                    value: '100.00',
                  ),
                  InfoRow(
                    label: 'Balance',
                    value: '-100.00',
                  ),
                  InfoRow(
                    label: 'Bill Attached',
                    value: '1',
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Total Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: navy,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Total',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: onNavy,
                    ),
                  ),
                  const SizedBox(height: 16),
                  InfoRow(
                    label: 'Expense Type',
                    value: 'Conference & trade show registration',
                    textColor: onNavy,
                  ),
                  InfoRow(
                    label: 'LPO Number',
                    value: '',
                    textColor: onNavy,
                  ),
                  InfoRow(
                    label: 'Cash Received',
                    value: '0.00',
                    textColor: onNavy,
                  ),
                  InfoRow(
                    label: 'Bill uploaded',
                    value: '100.00',
                    textColor: onNavy,
                  ),
                  InfoRow(
                    label: 'Balance',
                    value: '-100.00',
                    textColor: onNavy,
                  ),
                  InfoRow(
                    label: 'Bill Attached',
                    value: '1',
                    textColor: onNavy,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
