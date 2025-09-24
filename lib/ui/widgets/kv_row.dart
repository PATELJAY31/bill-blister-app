import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class KvRow extends StatelessWidget {
  final String label;
  final Widget value;
  final double labelWidth;
  final EdgeInsets? padding;
  final bool isCompact;
  final Color? labelColor;
  final Color? valueColor;
  final VoidCallback? onTap;

  const KvRow({
    super.key,
    required this.label,
    required this.value,
    this.labelWidth = 160,
    this.padding,
    this.isCompact = false,
    this.labelColor,
    this.valueColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final content = Padding(
      padding: padding ?? EdgeInsets.symmetric(
        vertical: isCompact ? 8 : 12,
        horizontal: isCompact ? 12 : 16,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: isCompact ? 120 : labelWidth,
            child: Text(
              label,
              style: TextStyle(
                fontSize: isCompact ? 14 : 16,
                fontWeight: FontWeight.w600,
                color: labelColor ?? textPrimary,
                letterSpacing: 0.1,
              ),
            ),
          ),
          SizedBox(width: isCompact ? 12 : 16),
          Expanded(
            child: DefaultTextStyle.merge(
              style: TextStyle(
                fontSize: isCompact ? 14 : 16,
                fontWeight: FontWeight.w500,
                color: valueColor ?? textSecondary,
                letterSpacing: 0.1,
              ),
              child: value,
            ),
          ),
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
