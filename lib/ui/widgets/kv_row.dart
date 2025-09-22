import 'package:flutter/material.dart';

class KvRow extends StatelessWidget {
  final String label;
  final Widget value;
  final double labelWidth;
  final EdgeInsets? padding;

  const KvRow({
    super.key,
    required this.label,
    required this.value,
    this.labelWidth = 160,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: padding ?? const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: labelWidth,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: DefaultTextStyle.merge(
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Color(0xFF374151),
              ),
              child: value,
            ),
          ),
        ],
      ),
    );
  }
}
