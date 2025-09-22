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

  const EmptyState({
    super.key,
    this.icon = Icons.inbox_outlined,
    required this.title,
    required this.subtitle,
    required this.primaryActionText,
    required this.secondaryActionText,
    this.onPrimaryAction,
    this.onSecondaryAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 560),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon with subtle background
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: navy.withOpacity(0.06),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: 40,
                  color: navy.withOpacity(0.6),
                ),
              ),

              const SizedBox(height: 24),

              // Title
              Text(
                title,
                style: Theme.of(context).textTheme.headlineLarge,
                textAlign: TextAlign.center,
                semanticsLabel: 'Empty state title: $title',
              ),

              const SizedBox(height: 8),

              // Subtitle
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
                semanticsLabel: 'Empty state subtitle: $subtitle',
              ),

              const SizedBox(height: 32),

              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Primary Action
                  TextButton.icon(
                    onPressed: onPrimaryAction,
                    icon: const Icon(Icons.add_rounded, size: 20),
                    label: Text(primaryActionText),
                    style: TextButton.styleFrom(
                      foregroundColor: navy,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                  ),

                  const SizedBox(width: 16),

                  // Secondary Action
                  OutlinedButton.icon(
                    onPressed: onSecondaryAction,
                    icon: const Icon(Icons.tune_rounded, size: 20),
                    label: Text(secondaryActionText),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: navy,
                      side: const BorderSide(color: divider),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
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
