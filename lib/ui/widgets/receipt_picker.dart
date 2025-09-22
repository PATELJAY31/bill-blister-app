import 'dart:io';
import 'package:flutter/material.dart';
import '../../models/receipt_attachment.dart';
import '../../theme/app_theme.dart';

class ReceiptPicker extends StatelessWidget {
  final List<ReceiptAttachment> items;
  final VoidCallback onPickCamera;
  final VoidCallback onPickGallery;
  final VoidCallback onPickFiles;
  final void Function(int index) onRemove;
  final void Function(int index) onPreview;

  const ReceiptPicker({
    super.key,
    required this.items,
    required this.onPickCamera,
    required this.onPickGallery,
    required this.onPickFiles,
    required this.onRemove,
    required this.onPreview,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Receipt',
                style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: textPrimary)),
            Wrap(
              spacing: 8,
              children: [
                ActionChip(
                  label: const Text('Camera'),
                  avatar: const Icon(Icons.photo_camera_outlined, size: 18),
                  onPressed: onPickCamera,
                ),
                ActionChip(
                  label: const Text('Gallery'),
                  avatar: const Icon(Icons.photo_library_outlined, size: 18),
                  onPressed: onPickGallery,
                ),
                ActionChip(
                  label: const Text('Files'),
                  avatar: const Icon(Icons.attach_file, size: 18),
                  onPressed: onPickFiles,
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (items.isEmpty)
          const Text('No receipt attached yet',
              style: TextStyle(color: textSecondary))
        else
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              for (int i = 0; i < items.length; i++)
                _buildChip(context, items[i], i),
            ],
          ),
      ],
    );
  }

  Widget _buildChip(BuildContext context, ReceiptAttachment att, int index) {
    if (att.isImage) {
      return Stack(
        clipBehavior: Clip.none,
        children: [
          InkWell(
            onTap: () => onPreview(index),
            borderRadius: BorderRadius.circular(12),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Container(
                width: 64,
                height: 64,
                color: Colors.grey[200],
                child: Image.file(File(att.path), fit: BoxFit.cover),
              ),
            ),
          ),
          Positioned(
            right: -6,
            top: -6,
            child: InkWell(
              onTap: () => onRemove(index),
              borderRadius: BorderRadius.circular(10),
              child: Container(
                width: 20,
                height: 20,
                decoration:
                    const BoxDecoration(color: navy, shape: BoxShape.circle),
                child: const Icon(Icons.close, size: 12, color: Colors.white),
              ),
            ),
          ),
        ],
      );
    }

    return InkWell(
      onTap: () => onPreview(index),
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: divider),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircleAvatar(
              radius: 16,
              backgroundColor: navy,
              child:
                  Icon(Icons.insert_drive_file, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
            Text(att.name, style: const TextStyle(color: textPrimary)),
            const SizedBox(width: 8),
            InkWell(
              onTap: () => onRemove(index),
              child: const Icon(Icons.close, size: 16, color: textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
