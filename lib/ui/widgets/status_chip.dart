import 'package:flutter/material.dart';
import '../../models/claim.dart';

class StatusChip extends StatelessWidget {
  final ClaimStatus status;

  const StatusChip({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    final Color text;
    final Color bg;
    switch (status) {
      case ClaimStatus.approved:
        text = const Color(0xFF0A7A32);
        bg = const Color(0xFF0A7A32).withOpacity(0.10);
        break;
      case ClaimStatus.rejected:
        text = const Color(0xFFB91C1C);
        bg = const Color(0xFFB91C1C).withOpacity(0.10);
        break;
      case ClaimStatus.pending:
      default:
        text = const Color(0xFF160C52);
        bg = const Color(0xFF160C52).withOpacity(0.10);
        break;
    }

    String label;
    switch (status) {
      case ClaimStatus.approved:
        label = 'APPROVED';
        break;
      case ClaimStatus.rejected:
        label = 'REJECTED';
        break;
      case ClaimStatus.pending:
        label = 'PENDING';
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: text,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
