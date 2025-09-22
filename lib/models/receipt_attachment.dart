class ReceiptAttachment {
  final String name;
  final String path;
  final String mimeType;
  final bool isImage;

  ReceiptAttachment({
    required this.name,
    required this.path,
    required this.mimeType,
    required this.isImage,
  });
}
