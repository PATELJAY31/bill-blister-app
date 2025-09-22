import 'package:flutter/material.dart';
import '../shell/app_shell.dart';
import '../../theme/app_theme.dart';

class NotificationsPage extends StatelessWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Notifications',
      showPlus: false,
      body: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) {
          final notifications = [
            {
              'title': 'New Expense Claim Submitted',
              'subtitle': 'John Doe submitted a claim for \$150.00',
              'time': '2 hours ago',
              'isRead': false,
            },
            {
              'title': 'Claim Approved',
              'subtitle': 'Your conference expense claim has been approved',
              'time': '1 day ago',
              'isRead': true,
            },
            {
              'title': 'Payment Processed',
              'subtitle': 'Payment of \$100.00 has been processed',
              'time': '2 days ago',
              'isRead': true,
            },
            {
              'title': 'Document Required',
              'subtitle': 'Please upload receipt for your recent claim',
              'time': '3 days ago',
              'isRead': false,
            },
            {
              'title': 'System Maintenance',
              'subtitle': 'Scheduled maintenance on Sunday 2:00 AM',
              'time': '1 week ago',
              'isRead': true,
            },
          ];

          final notification = notifications[index];

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: divider),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Notification icon
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: navy.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Icon(
                    Icons.notifications_outlined,
                    color: navy,
                    size: 20,
                  ),
                ),

                const SizedBox(width: 12),

                // Notification content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        notification['title'] as String,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        notification['subtitle'] as String,
                        style: TextStyle(
                          fontSize: 14,
                          color: textSecondary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        notification['time'] as String,
                        style: TextStyle(
                          fontSize: 12,
                          color: textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                // Read indicator
                if (!(notification['isRead'] as bool))
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: navy,
                      shape: BoxShape.circle,
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
