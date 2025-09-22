import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class UmMenuItem extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback? onTap;

  const UmMenuItem({
    super.key,
    required this.label,
    this.selected = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Widget content = Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      margin: selected
          ? const EdgeInsets.symmetric(vertical: 10).copyWith(right: 24)
          : const EdgeInsets.symmetric(vertical: 18),
      decoration: BoxDecoration(
        color: selected ? chipBg : Colors.transparent,
        borderRadius: BorderRadius.circular(28),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: selected ? chipText : textPrimary,
          fontSize: 18,
          fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
        ),
      ),
    );

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(28),
      child: Semantics(
        button: true,
        label: label,
        selected: selected,
        child: content,
      ),
    );
  }
}
