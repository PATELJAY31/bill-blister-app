import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class UmDrawerHeader extends StatelessWidget {
  final VoidCallback? onLogout;

  const UmDrawerHeader({super.key, this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 220,
      padding: const EdgeInsets.all(20),
      color: surface,
      child: Stack(
        children: [
          // Brand placeholder (RichText)
          Align(
            alignment: Alignment.centerLeft,
            child: _buildBrandPlaceholder(),
          ),

          // Power icon button
          Positioned(
            top: 8,
            right: 8,
            child: InkWell(
              onTap: onLogout,
              borderRadius: BorderRadius.circular(24),
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(color: divider),
                  boxShadow: const [
                    BoxShadow(
                      blurRadius: 8,
                      color: Colors.black12,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.power_settings_new_rounded,
                  color: textPrimary,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBrandPlaceholder() {
    return RichText(
      text: TextSpan(
        style: const TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          height: 1.2,
          letterSpacing: 0.2,
        ),
        children: const [
          TextSpan(text: 'Uni', style: TextStyle(color: navy)),
          TextSpan(text: 'Misk', style: TextStyle(color: Colors.red)),
          TextSpan(text: '\n'),
          TextSpan(
            text: 'ERP Solutions',
            style: TextStyle(
                fontSize: 16, color: navy, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}
