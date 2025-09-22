import 'package:flutter/material.dart';

class NavUtils {
  static bool handleRootBack({
    required BuildContext context,
    required DateTime? lastBackPressedAt,
    required void Function(DateTime) updateLastBackPressed,
    Duration timeout = const Duration(seconds: 2),
    String message = 'Press back again to exit the app',
  }) {
    final DateTime now = DateTime.now();
    if (lastBackPressedAt == null ||
        now.difference(lastBackPressedAt) > timeout) {
      updateLastBackPressed(now);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(message), duration: timeout));
      return false;
    }
    return true;
  }
}
