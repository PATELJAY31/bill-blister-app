import 'package:permission_handler/permission_handler.dart';

Future<bool> ensureCamera() async {
  final status = await Permission.camera.request();
  if (status.isGranted) return true;
  if (status.isPermanentlyDenied) {
    await openAppSettings();
  }
  return false;
}

Future<bool> ensurePhotos() async {
  // On Android 13+ READ_MEDIA_IMAGES; older use storage
  final photos = await Permission.photos.request();
  if (photos.isGranted) return true;
  if (photos.isPermanentlyDenied) {
    await openAppSettings();
  }
  // Fallback to storage
  final storage = await Permission.storage.request();
  if (storage.isGranted) return true;
  if (storage.isPermanentlyDenied) {
    await openAppSettings();
  }
  return false;
}
