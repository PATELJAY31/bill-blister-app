import 'dart:async';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import '../shell/app_shell.dart';
import '../../models/receipt_attachment.dart';
import '../../utils/permissions.dart';
import '../../theme/app_theme.dart';

class ExpenseClaimNewPage extends StatefulWidget {
  const ExpenseClaimNewPage({super.key});

  @override
  State<ExpenseClaimNewPage> createState() => _ExpenseClaimNewPageState();
}

class _ExpenseClaimNewPageState extends State<ExpenseClaimNewPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _expenseTypeCtrl = TextEditingController();
  String? _lpo;
  final TextEditingController _billNoCtrl = TextEditingController();
  final TextEditingController _amountCtrl = TextEditingController();
  DateTime _billDate = DateTime.now();
  final TextEditingController _notesCtrl = TextEditingController();
  final List<ReceiptAttachment> _attachments = [];
  bool _dirty = false;

  @override
  void dispose() {
    _expenseTypeCtrl.dispose();
    _billNoCtrl.dispose();
    _amountCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  Widget _buildFormContent(
      BuildContext context, bool isTablet, bool isCompact) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buildSelectors(context, isTablet: isTablet),
        const SizedBox(height: 16),
        _buildBillNumber(),
        const SizedBox(height: 16),
        _buildAmount(),
        const SizedBox(height: 16),
        _buildBillDate(context),
        const SizedBox(height: 16),
        _buildReceiptSection(context),
        const SizedBox(height: 16),
        _buildNotes(),
        const SizedBox(height: 24),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    final width = media.size.width;
    final isCompact = width <= 360;
    final isTablet = width >= 720;
    final outerPad = EdgeInsets.all(isCompact ? 12 : 16);
    return AppShell(
      title: 'Expense Claim',
      showPlus: false,
      showFilter: false,
      showBell: false,
      body: WillPopScope(
        onWillPop: _confirmDiscardIfDirty,
        child: LayoutBuilder(
          builder: (context, constraints) {
            final maxContentWidth = 600.0;
            final viewInsets = MediaQuery.of(context).viewInsets.bottom;
            return Container(
              color: const Color(0xFFF8F9FB),
              child: Stack(
                children: [
                  Align(
                    alignment: Alignment.topCenter,
                    child: SingleChildScrollView(
                      padding: EdgeInsets.only(
                        left: outerPad.left,
                        right: outerPad.right,
                        top: outerPad.top,
                        bottom: 100 + (viewInsets > 0 ? viewInsets : 0),
                      ),
                      child: Center(
                        child: ConstrainedBox(
                          constraints:
                              BoxConstraints(maxWidth: maxContentWidth),
                          child: Form(
                            key: _formKey,
                            autovalidateMode:
                                AutovalidateMode.onUserInteraction,
                            onChanged: () => setState(() => _dirty = true),
                            child:
                                _buildFormContent(context, isTablet, isCompact),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    left: 0,
                    right: 0,
                    bottom: 0,
                    child: SafeArea(
                      top: false,
                      child: Center(
                        child: Padding(
                          padding: EdgeInsets.fromLTRB(
                            outerPad.left,
                            8,
                            outerPad.right,
                            outerPad.bottom,
                          ),
                          child: ConstrainedBox(
                            constraints:
                                BoxConstraints(maxWidth: maxContentWidth),
                            child: _buildSubmitButton(),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Future<bool> _confirmDiscardIfDirty() async {
    if (!_dirty) return true;
    final ok = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('Discard changes?'),
        content: const Text('You have unsaved changes.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(c, false),
              child: const Text('Cancel')),
          TextButton(
              onPressed: () => Navigator.pop(c, true),
              child: const Text('Discard')),
        ],
      ),
    );
    return ok ?? false;
  }

  Widget _buildSelectors(BuildContext context, {required bool isTablet}) {
    final children = [
      Expanded(
        child: _RoundedField(
          label: 'Expense Type *',
          valueText: _expenseTypeCtrl.text.isEmpty
              ? 'Select expense type'
              : _expenseTypeCtrl.text,
          onTap: () => _openExpenseTypeSheet(context),
        ),
      ),
      const SizedBox(width: 12, height: 12),
      Expanded(
        child: _RoundedField(
          label: 'LPO Number',
          valueText: _lpo ?? 'None',
          onTap: () => _openLpoSheet(context),
        ),
      ),
    ];

    if (isTablet) {
      return Row(
          crossAxisAlignment: CrossAxisAlignment.start, children: children);
    } else {
      return Column(
          children: [children[0], const SizedBox(height: 12), children[2]]);
    }
  }

  Widget _buildBillNumber() {
    return _RoundedTextField(
      controller: _billNoCtrl,
      label: 'Bill Number',
      validator: (v) =>
          (v == null || v.trim().isEmpty) ? 'Bill number is required' : null,
      textInputAction: TextInputAction.next,
      onFieldSubmitted: (_) => FocusScope.of(context).nextFocus(),
    );
  }

  Widget _buildAmount() {
    return _RoundedTextField(
      controller: _amountCtrl,
      label: 'Bill Amount',
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      textAlign: TextAlign.right,
      validator: (v) {
        if (v == null || v.trim().isEmpty) return 'Amount is required';
        final d = double.tryParse(v.replaceAll(',', ''));
        if (d == null) return 'Enter a valid number';
        return null;
      },
      onEditingComplete: () {
        final d = double.tryParse(_amountCtrl.text.replaceAll(',', ''));
        if (d != null) {
          _amountCtrl.text = d.toStringAsFixed(2);
        }
        FocusScope.of(context).nextFocus();
      },
    );
  }

  Widget _buildBillDate(BuildContext context) {
    return _RoundedField(
      label: 'Bill Date *',
      valueText: _fmtDate(_billDate),
      onTap: () async {
        final now = DateTime.now();
        final first = DateTime(now.year - 2, now.month, now.day);
        final picked = await showDatePicker(
          context: context,
          initialDate: _billDate,
          firstDate: first,
          lastDate: now,
        );
        if (picked != null) setState(() => _billDate = picked);
      },
      required: true,
    );
  }

  Widget _buildReceiptSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LayoutBuilder(builder: (context, constraints) {
          final isWide = constraints.maxWidth >= 480;
          final chips = Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildActionChip(
                  label: 'Camera',
                  icon: Icons.photo_camera,
                  onTap: _pickFromCamera,
                  semantics: 'Add receipt from camera'),
              const SizedBox(width: 8),
              _buildActionChip(
                  label: 'Gallery',
                  icon: Icons.photo_library,
                  onTap: _pickFromGallery,
                  semantics: 'Add receipt from gallery'),
              const SizedBox(width: 8),
              _buildActionChip(
                  label: 'Files',
                  icon: Icons.attach_file,
                  onTap: _pickFromFiles,
                  semantics: 'Add receipt from files'),
            ],
          );
          return Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Expanded(
                child: Text('Receipt',
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
              if (isWide)
                chips
              else
                Flexible(
                    child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal, child: chips)),
            ],
          );
        }),
        const SizedBox(height: 12),
        _buildAttachmentsCarousel(),
      ],
    );
  }

  Widget _buildActionChip(
      {required String label,
      required IconData icon,
      required VoidCallback onTap,
      required String semantics}) {
    return Semantics(
      label: semantics,
      button: true,
      child: ActionChip(
        avatar: Icon(icon, size: 18),
        label: Text(label),
        onPressed: onTap,
        materialTapTargetSize: MaterialTapTargetSize.padded,
      ),
    );
  }

  Widget _buildAttachmentsCarousel() {
    if (_attachments.isEmpty) return const SizedBox.shrink();
    return SizedBox(
      height: 110,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _attachments.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final a = _attachments[index];
          return GestureDetector(
            onTap: () {
              if (a.isImage) {
                showDialog(
                  context: context,
                  builder: (_) => Dialog(
                    child: InteractiveViewer(
                      child: kIsWeb
                        ? Container(
                            width: 400,
                            height: 400,
                            color: Colors.grey[300],
                            child: const Center(
                              child: Icon(Icons.image, size: 100),
                            ),
                          )
                        : Image.file(File(a.path), fit: BoxFit.contain),
                    ),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Preview not available')),
                );
              }
            },
            child: Stack(
              children: [
                Container(
                  width: 120,
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFE5E7EB)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (a.isImage)
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: kIsWeb 
                            ? Container(
                                width: 72,
                                height: 72,
                                color: Colors.grey[300],
                                child: const Icon(Icons.image, size: 36),
                              )
                            : Image.file(
                                File(a.path),
                                width: 72,
                                height: 72,
                                fit: BoxFit.cover,
                              ),
                        )
                      else
                        const SizedBox(
                          width: 72,
                          height: 72,
                          child: Center(
                              child: Icon(Icons.picture_as_pdf, size: 36)),
                        ),
                      const SizedBox(height: 6),
                      Text(
                        a.name,
                        style: const TextStyle(fontSize: 12),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                Positioned(
                  right: 4,
                  top: 4,
                  child: InkWell(
                    onTap: () => setState(() => _attachments.removeAt(index)),
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Colors.black54,
                        shape: BoxShape.circle,
                      ),
                      padding: const EdgeInsets.all(2),
                      child: const Icon(Icons.close,
                          size: 14, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildNotes() {
    return _RoundedTextField(
      controller: _notesCtrl,
      label: 'Notes (optional)',
      maxLines: 5,
    );
  }

  Widget _buildSubmitButton() {
    final valid = _expenseTypeCtrl.text.isNotEmpty &&
        _billNoCtrl.text.trim().isNotEmpty &&
        double.tryParse(_amountCtrl.text.replaceAll(',', '')) != null;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      height: 58,
      child: FilledButton.icon(
        onPressed: valid ? _submit : null,
        icon: const Icon(Icons.send_rounded, size: 20),
        label: const Text(
          'Submit Claim',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.1,
          ),
        ),
        style: FilledButton.styleFrom(
          backgroundColor: valid ? navy : textDisabled,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: valid ? 4 : 0,
          shadowColor: valid ? navy.withOpacity(0.3) : Colors.transparent,
        ),
      ),
    );
  }

  Future<void> _openExpenseTypeSheet(BuildContext context) async {
    final options = <String>[
      'Food',
      'Travel',
      'Administrative Expenses Related to Sales',
      'Conference & trade show registration',
      'Office Supplies',
      'Utilities',
      'Telecommunications',
      'Maintenance and Repairs',
      'Training and Development',
    ];
    String query = '';
    final controller = TextEditingController();
    final debouncer = _Debouncer(const Duration(milliseconds: 250));
    final selected = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      builder: (c) {
        return SafeArea(
          child: StatefulBuilder(builder: (c, setSt) {
            List<String> filtered = options
                .where((e) => e.toLowerCase().contains(query.toLowerCase()))
                .toList();
            return SizedBox(
              height: MediaQuery.of(c).size.height * 0.9,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: TextField(
                      controller: controller,
                      decoration: const InputDecoration(
                        hintText: 'Search expense type',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.search),
                      ),
                      onChanged: (v) => debouncer.run(() {
                        query = v;
                        setSt(() {});
                      }),
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(
                    child: ListView.separated(
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (c, i) {
                        final item = filtered[i];
                        final isSel = item == _expenseTypeCtrl.text;
                        return ListTile(
                          title: Text(item),
                          trailing: isSel ? const Icon(Icons.check) : null,
                          onTap: () {
                            HapticFeedback.selectionClick();
                            Navigator.pop(c, item);
                          },
                          minTileHeight: 56,
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          }),
        );
      },
    );
    if (selected != null) {
      setState(() {
        _expenseTypeCtrl.text = selected;
      });
    }
  }

  Future<void> _openLpoSheet(BuildContext context) async {
    final lpos = <String?>['None', 'LPO-0012', 'LPO-0031', 'LPO-0104'];
    final selected = await showModalBottomSheet<String?>(
      context: context,
      builder: (c) => SafeArea(
        child: ListView.separated(
          itemCount: lpos.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (c, i) {
            final item = lpos[i];
            final isSel = item == (_lpo ?? 'None');
            return ListTile(
              title: Text(item ?? 'None'),
              trailing: isSel ? const Icon(Icons.check) : null,
              onTap: () => Navigator.pop(c, item == 'None' ? null : item),
              minTileHeight: 56,
            );
          },
        ),
      ),
    );
    setState(() => _lpo = selected);
  }

  Future<void> _pickFromCamera() async {
    if (_attachments.length >= 5) return;
    
    // Skip camera on web platform
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Camera not available on web platform')),
      );
      return;
    }
    
    if (!await ensureCamera()) return;
    final ImagePicker picker = ImagePicker();
    final XFile? img =
        await picker.pickImage(source: ImageSource.camera, imageQuality: 80);
    if (img != null) {
      setState(() {
        _attachments.add(ReceiptAttachment(
          name: img.name,
          path: img.path,
          mimeType: 'image/jpeg',
          isImage: true,
        ));
      });
    }
  }

  Future<void> _pickFromGallery() async {
    if (_attachments.length >= 5) return;
    
    // Skip gallery on web platform
    if (kIsWeb) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Gallery not available on web platform')),
      );
      return;
    }
    
    if (!await ensurePhotos()) return;
    final ImagePicker picker = ImagePicker();
    final List<XFile> imgs = await picker.pickMultiImage(imageQuality: 80);
    setState(() {
      for (final img in imgs.take(5 - _attachments.length)) {
        _attachments.add(ReceiptAttachment(
          name: img.name,
          path: img.path,
          mimeType: 'image/jpeg',
          isImage: true,
        ));
      }
    });
  }

  Future<void> _pickFromFiles() async {
    if (_attachments.length >= 5) return;
    final res = await FilePicker.platform.pickFiles(
      allowMultiple: true,
      type: FileType.custom,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
    );
    if (res == null) return;
    setState(() {
      for (final f in res.files.take(5 - _attachments.length)) {
        final path = f.path!;
        final name = f.name;
        final ext = name.toLowerCase();
        final isImage = ext.endsWith('.jpg') ||
            ext.endsWith('.jpeg') ||
            ext.endsWith('.png');
        _attachments.add(ReceiptAttachment(
          name: name,
          path: path,
          mimeType: isImage ? 'image/jpeg' : 'application/pdf',
          isImage: isImage,
        ));
      }
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_attachments.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No receipt attached (optional)')),
      );
    }
    final payload = {
      'expenseType': _expenseTypeCtrl.text,
      'lpoNumber': _lpo,
      'billNumber': _billNoCtrl.text.trim(),
      'billAmount': double.parse(_amountCtrl.text.replaceAll(',', '')),
      'billDate': _fmtDate(_billDate),
      'notes': _notesCtrl.text.trim(),
      'attachments': _attachments
          .map((a) => {
                'name': a.name,
                'path': a.path,
                'mime': a.mimeType,
                'isImage': a.isImage,
              })
          .toList(),
    };
    // ignore: avoid_print
    print('SUBMIT_CLAIM: $payload');
    HapticFeedback.lightImpact();
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Claim submitted (mock)')),
    );
    Navigator.pop(context);
  }

  String _fmtDate(DateTime d) {
    final dd = d.day.toString().padLeft(2, '0');
    final mm = d.month.toString().padLeft(2, '0');
    final yy = d.year.toString();
    return '$dd-$mm-$yy';
  }
}

class _RoundedField extends StatelessWidget {
  final String label;
  final String valueText;
  final bool required;
  final VoidCallback onTap;

  const _RoundedField({
    required this.label,
    required this.valueText,
    required this.onTap,
    this.required = false,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          height: 58,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: surfaceTertiary,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: border),
          ),
          alignment: Alignment.centerLeft,
          child: Row(
            children: [
              Text(
                label + (required ? ' *' : ''),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: textPrimary,
                  letterSpacing: 0.1,
                ),
              ),
              const Spacer(),
              Flexible(
                child: Text(
                  valueText,
                  style: TextStyle(
                    color: valueText == 'Select expense type' || valueText == 'None'
                        ? textTertiary
                        : textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    letterSpacing: 0.1,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.expand_more_rounded,
                color: textSecondary,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoundedTextField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final String? Function(String?)? validator;
  final TextInputAction? textInputAction;
  final TextInputType? keyboardType;
  final TextAlign? textAlign;
  final VoidCallback? onEditingComplete;
  final ValueChanged<String>? onFieldSubmitted;
  final int? maxLines;

  const _RoundedTextField({
    required this.controller,
    required this.label,
    this.validator,
    this.textInputAction,
    this.keyboardType,
    this.textAlign,
    this.onEditingComplete,
    this.maxLines,
    this.onFieldSubmitted,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: maxLines == null ? 58 : null,
      child: TextFormField(
        controller: controller,
        validator: validator,
        textInputAction: textInputAction,
        keyboardType: keyboardType,
        textAlign: textAlign ?? TextAlign.start,
        onEditingComplete: onEditingComplete,
        maxLines: maxLines ?? 1,
        onFieldSubmitted: onFieldSubmitted,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: textPrimary,
          letterSpacing: 0.1,
        ),
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: surfaceTertiary,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: border),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: border),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: navy, width: 2),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: error, width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          labelStyle: const TextStyle(
            color: textSecondary,
            fontSize: 16,
            fontWeight: FontWeight.w500,
            letterSpacing: 0.1,
          ),
          hintStyle: const TextStyle(
            color: textTertiary,
            fontSize: 16,
            fontWeight: FontWeight.w400,
            letterSpacing: 0.1,
          ),
        ),
      ),
    );
  }
}

class _Debouncer {
  final Duration delay;
  Timer? _timer;
  _Debouncer(this.delay);
  void run(VoidCallback action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }
}
