import 'package:flutter/material.dart';
import '../../models/claim.dart';
import '../../theme/app_theme.dart';

class StatusChip extends StatelessWidget {
  final ClaimStatus status;
  final bool isCompact;

  const StatusChip({
    super.key, 
    required this.status,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    final Color textColor;
    final Color backgroundColor;
    final IconData icon;
    
    switch (status) {
      case ClaimStatus.approved:
        textColor = success;
        backgroundColor = successLight;
        icon = Icons.check_circle_rounded;
        break;
      case ClaimStatus.rejected:
        textColor = error;
        backgroundColor = errorLight;
        icon = Icons.cancel_rounded;
        break;
      case ClaimStatus.pending:
        textColor = warning;
        backgroundColor = warningLight;
        icon = Icons.schedule_rounded;
        break;
    }

    String label;
    switch (status) {
      case ClaimStatus.approved:
        label = 'Approved';
        break;
      case ClaimStatus.rejected:
        label = 'Rejected';
        break;
      case ClaimStatus.pending:
        label = 'Pending';
        break;
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: EdgeInsets.symmetric(
        horizontal: isCompact ? 8 : 12,
        vertical: isCompact ? 4 : 6,
      ),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: textColor.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: textColor.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: isCompact ? 14 : 16,
            color: textColor,
          ),
          if (!isCompact) ...[
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: textColor,
                fontSize: isCompact ? 12 : 14,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.1,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
