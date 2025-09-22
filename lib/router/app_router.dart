import 'package:flutter/material.dart';
import '../ui/pages/amount_allocation_page.dart';
import '../ui/pages/notifications_page.dart';
import '../ui/pages/add_allocation_page.dart';
import '../ui/pages/expense_claim_page.dart';
import '../ui/pages/expense_claim_new_page.dart';
import '../ui/pages/claim_verification_page.dart';
import '../ui/pages/claim_approval_page.dart';

class AppRouter {
  static const String initialRoute = '/amount-allocation';

  static final Map<String, WidgetBuilder> routes = {
    '/amount-allocation': (context) => const AmountAllocationPage(),
    '/expense-claim': (context) => const ExpenseClaimPage(),
    '/expense-claim/new': (context) => const ExpenseClaimNewPage(),
    '/claim-verification': (context) => const ClaimVerificationPage(),
    '/claim-approval': (context) => const ClaimApprovalPage(),
    '/notifications': (context) => const NotificationsPage(),
    '/add-allocation': (context) => const AddAllocationPage(),
  };

  static bool isCurrent(BuildContext context, String routeName) {
    final currentRoute = ModalRoute.of(context)?.settings.name;
    return currentRoute == routeName;
  }
}
