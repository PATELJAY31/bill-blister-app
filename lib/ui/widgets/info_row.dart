import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? textColor;
  final TextStyle? labelStyle;
  final TextStyle? valueStyle;

  const InfoRow({
    super.key,
    required this.label,
    required this.value,
    this.textColor,
    this.labelStyle,
    this.valueStyle,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveTextColor = textColor ?? textPrimary;
    final effectiveLabelStyle = labelStyle ??
        TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: effectiveTextColor,
        );
    final effectiveValueStyle = valueStyle ??
        TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: effectiveTextColor,
        );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label column (fixed width)
          SizedBox(
            width: 160,
            child: Text(
              label,
              style: effectiveLabelStyle,
            ),
          ),

          const SizedBox(width: 16),

          // Value column (flexible)
          Expanded(
            child: Text(
              value.isEmpty ? '—' : value,
              style: effectiveValueStyle.copyWith(
                color:
                    value.isEmpty ? textSecondary : effectiveValueStyle.color,
              ),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
