import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? textColor;
  final TextStyle? labelStyle;
  final TextStyle? valueStyle;
  final bool isCompact;
  final Widget? trailing;
  final VoidCallback? onTap;

  const InfoRow({
    super.key,
    required this.label,
    required this.value,
    this.textColor,
    this.labelStyle,
    this.valueStyle,
    this.isCompact = false,
    this.trailing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveTextColor = textColor ?? textPrimary;
    final effectiveLabelStyle = labelStyle ??
        TextStyle(
          fontSize: isCompact ? 14 : 16,
          fontWeight: FontWeight.w600,
          color: effectiveTextColor,
          letterSpacing: 0.1,
        );
    final effectiveValueStyle = valueStyle ??
        TextStyle(
          fontSize: isCompact ? 14 : 16,
          fontWeight: FontWeight.w500,
          color: value.isEmpty ? textTertiary : effectiveTextColor,
          letterSpacing: 0.1,
        );

    final content = Padding(
      padding: EdgeInsets.symmetric(
        vertical: isCompact ? 8 : 12,
        horizontal: isCompact ? 12 : 16,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Label column (fixed width)
          SizedBox(
            width: isCompact ? 120 : 160,
            child: Text(
              label,
              style: effectiveLabelStyle,
            ),
          ),

          SizedBox(width: isCompact ? 12 : 16),

          // Value column (flexible)
          Expanded(
            child: Text(
              value.isEmpty ? '—' : value,
              style: effectiveValueStyle,
              textAlign: TextAlign.right,
            ),
          ),

          // Trailing widget
          if (trailing != null) ...[
            const SizedBox(width: 8),
            trailing!,
          ],
        ],
      ),
    );

    if (onTap != null) {
      return Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: content,
        ),
      );
    }

    return content;
  }
}
