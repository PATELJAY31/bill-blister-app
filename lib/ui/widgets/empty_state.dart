import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String primaryActionText;
  final String secondaryActionText;
  final VoidCallback? onPrimaryAction;
  final VoidCallback? onSecondaryAction;
  final bool isCompact;

  const EmptyState({
    super.key,
    this.icon = Icons.inbox_outlined,
    required this.title,
    required this.subtitle,
    required this.primaryActionText,
    required this.secondaryActionText,
    this.onPrimaryAction,
    this.onSecondaryAction,
    this.isCompact = false,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: isCompact ? 400 : 560,
        ),
        child: Padding(
          padding: EdgeInsets.all(isCompact ? 20 : 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon with enhanced background
              Container(
                width: isCompact ? 64 : 96,
                height: isCompact ? 64 : 96,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      navy.withOpacity(0.08),
                      navyLight.withOpacity(0.04),
                    ],
                  ),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: navy.withOpacity(0.1),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Icon(
                  icon,
                  size: isCompact ? 32 : 48,
                  color: navy.withOpacity(0.7),
                ),
              ),

              SizedBox(height: isCompact ? 20 : 32),

              // Title
              Text(
                title,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontSize: isCompact ? 20 : 24,
                  fontWeight: FontWeight.w700,
                  color: textPrimary,
                ),
                textAlign: TextAlign.center,
                semanticsLabel: 'Empty state title: $title',
              ),

              SizedBox(height: isCompact ? 8 : 12),

              // Subtitle
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  fontSize: isCompact ? 14 : 16,
                  color: textSecondary,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
                semanticsLabel: 'Empty state subtitle: $subtitle',
              ),

              SizedBox(height: isCompact ? 24 : 40),

              // Action Buttons
              if (onPrimaryAction != null || onSecondaryAction != null)
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  alignment: WrapAlignment.center,
                  children: [
                    // Primary Action
                    if (onPrimaryAction != null)
                      FilledButton.icon(
                        onPressed: onPrimaryAction,
                        icon: const Icon(Icons.add_rounded, size: 18),
                        label: Text(primaryActionText),
                        style: FilledButton.styleFrom(
                          backgroundColor: navy,
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(
                            horizontal: isCompact ? 16 : 24,
                            vertical: isCompact ? 12 : 16,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),

                    // Secondary Action
                    if (onSecondaryAction != null)
                      OutlinedButton.icon(
                        onPressed: onSecondaryAction,
                        icon: const Icon(Icons.refresh_rounded, size: 18),
                        label: Text(secondaryActionText),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: navy,
                          side: const BorderSide(color: border, width: 1.5),
                          padding: EdgeInsets.symmetric(
                            horizontal: isCompact ? 16 : 24,
                            vertical: isCompact ? 12 : 16,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
