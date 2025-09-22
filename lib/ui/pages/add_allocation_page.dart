import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../../theme/app_theme.dart';
import '../../models/receipt_attachment.dart';
import '../../utils/permissions.dart';
import '../widgets/receipt_picker.dart';

class AddAllocationPage extends StatefulWidget {
  const AddAllocationPage({super.key});

  @override
  State<AddAllocationPage> createState() => _AddAllocationPageState();
}

class _AddAllocationPageState extends State<AddAllocationPage> {
  final _formKey = GlobalKey<FormState>();
  final _dateController = TextEditingController();
  final _employeeController = TextEditingController();
  final _typeController = TextEditingController();
  final _lpoController = TextEditingController();
  final _amountController = TextEditingController();
  final _notesController = TextEditingController();
  final List<ReceiptAttachment> _attachments = [];

  @override
  void dispose() {
    _dateController.dispose();
    _employeeController.dispose();
    _typeController.dispose();
    _lpoController.dispose();
    _amountController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF160C52),
        foregroundColor: Colors.white,
        centerTitle: true,
        title: const Text('Amount Allocation',
            style: TextStyle(fontWeight: FontWeight.w700)),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(12)),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _filledField(
                  child: TextFormField(
                    controller: _dateController,
                    readOnly: true,
                    decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: 'Allocation Date',
                        prefixIcon: Icon(Icons.calendar_today)),
                    validator: _required,
                    onTap: () async {
                      final now = DateTime.now();
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: now,
                        firstDate: DateTime(now.year - 5),
                        lastDate: DateTime(now.year + 5),
                      );
                      if (picked != null) {
                        _dateController.text =
                            '${picked.day.toString().padLeft(2, '0')}-${picked.month.toString().padLeft(2, '0')}-${picked.year}';
                      }
                    },
                  ),
                ),
                const SizedBox(height: 16),
                _filledField(
                  child: DropdownButtonFormField<String>(
                    value: _employeeController.text.isEmpty
                        ? null
                        : _employeeController.text,
                    items: const [
                      DropdownMenuItem(
                          value: 'Divyangini Patel',
                          child: Text('Divyangini Patel')),
                      DropdownMenuItem(
                          value: 'Kartik Mistry', child: Text('Kartik Mistry')),
                      DropdownMenuItem(
                          value: 'Admin User', child: Text('Admin User')),
                      DropdownMenuItem(
                          value: 'Ketan Mistry', child: Text('Ketan Mistry')),
                    ],
                    onChanged: (v) => _employeeController.text = v ?? '',
                    decoration: const InputDecoration(
                        border: InputBorder.none, hintText: 'Select Employee'),
                    validator: (v) =>
                        (v == null || v.isEmpty) ? 'Required' : null,
                  ),
                ),
                const SizedBox(height: 16),
                _filledField(
                  child: DropdownButtonFormField<String>(
                    value: _typeController.text.isEmpty
                        ? null
                        : _typeController.text,
                    items: const [
                      DropdownMenuItem(value: 'Fuel', child: Text('Fuel')),
                      DropdownMenuItem(
                          value: 'Travel & Entertainment',
                          child: Text('Travel & Entertainment')),
                      DropdownMenuItem(value: 'Hotels', child: Text('Hotels')),
                      DropdownMenuItem(
                          value: 'Admin Expenses',
                          child: Text('Admin Expenses')),
                      DropdownMenuItem(value: 'Food', child: Text('Food')),
                    ],
                    onChanged: (v) => _typeController.text = v ?? '',
                    decoration: const InputDecoration(
                        border: InputBorder.none,
                        hintText: 'Select Expense Type'),
                    validator: (v) =>
                        (v == null || v.isEmpty) ? 'Required' : null,
                  ),
                ),
                const SizedBox(height: 16),
                _filledField(
                  child: TextFormField(
                    controller: _amountController,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.right,
                    decoration: const InputDecoration(
                        border: InputBorder.none, hintText: 'Amount'),
                    validator: (v) => v == null || double.tryParse(v) == null
                        ? 'Enter valid amount'
                        : null,
                  ),
                ),
                const SizedBox(height: 16),
                _filledField(
                  minHeight: 120,
                  child: TextFormField(
                    controller: _notesController,
                    minLines: 4,
                    maxLines: 6,
                    decoration: const InputDecoration(
                        border: InputBorder.none, hintText: 'Notes'),
                  ),
                ),
                const SizedBox(height: 16),
                ReceiptPicker(
                  items: _attachments,
                  onPickCamera: _pickFromCamera,
                  onPickGallery: _pickFromGallery,
                  onPickFiles: _pickFromFiles,
                  onRemove: _removeAt,
                  onPreview: _preview,
                ),
                const SizedBox(height: 24),
                SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF160C52),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _submit,
                    child: const Text('Submit',
                        style: TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String? _required(String? v) => (v == null || v.isEmpty) ? 'Required' : null;

  Widget _filledField({required Widget child, double minHeight = 56}) {
    return Container(
      constraints: BoxConstraints(minHeight: minHeight),
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
          color: const Color(0xFFEFEFEF),
          borderRadius: BorderRadius.circular(16)),
      alignment: Alignment.centerLeft,
      child: child,
    );
  }

  Future<void> _pickFromCamera() async {
    if (!await ensureCamera()) return;
    final XFile? f = await ImagePicker().pickImage(source: ImageSource.camera);
    if (f == null) return;
    setState(() {
      _attachments.add(ReceiptAttachment(
          name: f.name, path: f.path, mimeType: 'image/jpeg', isImage: true));
    });
  }

  Future<void> _pickFromGallery() async {
    if (!await ensurePhotos()) return;
    final XFile? f = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (f == null) return;
    setState(() {
      _attachments.add(ReceiptAttachment(
          name: f.name, path: f.path, mimeType: 'image/jpeg', isImage: true));
    });
  }

  Future<void> _pickFromFiles() async {
    if (!await ensurePhotos()) return;
    final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg']);
    if (result == null || result.files.isEmpty) return;
    final file = result.files.first;
    final isImage =
        ['png', 'jpg', 'jpeg'].any((e) => file.name.toLowerCase().endsWith(e));
    setState(() {
      _attachments.add(ReceiptAttachment(
          name: file.name,
          path: file.path!,
          mimeType: isImage ? 'image/*' : 'application/pdf',
          isImage: isImage));
    });
  }

  void _removeAt(int i) => setState(() => _attachments.removeAt(i));

  void _preview(int i) {
    final att = _attachments[i];
    if (!att.isImage) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Preview not available')));
      return;
    }
    showDialog(
      context: context,
      builder: (_) => Dialog(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.file(File(att.path), fit: BoxFit.contain),
        ),
      ),
    );
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    if (_attachments.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('No receipt attached (optional)')));
    }
    final payload = {
      'date': _dateController.text,
      'employee': _employeeController.text,
      'type': _typeController.text,
      'lpo': _lpoController.text,
      'amount': _amountController.text,
      'notes': _notesController.text,
      'attachments': _attachments.map((e) => e.name).toList(),
    };
    // ignore: avoid_print
    print(payload);
    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Allocation submitted (mock)')));
    Navigator.pop(context);
  }
}
