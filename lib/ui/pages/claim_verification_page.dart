import 'dart:io';
import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../models/claim.dart';
import '../shell/app_shell.dart';
import '../widgets/kv_row.dart';
import '../widgets/status_chip.dart';

class ClaimVerificationPage extends StatefulWidget {
  const ClaimVerificationPage({super.key});

  @override
  State<ClaimVerificationPage> createState() => _ClaimVerificationPageState();
}

class _ClaimVerificationPageState extends State<ClaimVerificationPage> {
  late Claim claim;

  @override
  void initState() {
    super.initState();
    claim = mockClaim();
  }

  @override
  Widget build(BuildContext context) {
    return AppShell(
      title: 'Expense Claim\nVerification',
      showPlus: false,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const SizedBox(height: 12),

                // Receipt avatar
                Center(
                  child: GestureDetector(
                    onTap: () => _onTapReceipt(context),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Container(
                          width: 124,
                          height: 124,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: divider, width: 3),
                            color: Colors.white,
                          ),
                          child: CircleAvatar(
                            backgroundColor: Colors.white,
                            radius: 60,
                            backgroundImage: claim.fileUrl != null
                                ? NetworkImage(claim.fileUrl!)
                                : null,
                            child: claim.fileUrl == null
                                ? const Icon(
                                    Icons.image_outlined,
                                    size: 40,
                                    color: Color(0xFF9CA3AF),
                                  )
                                : null,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 8),

                _VerificationCard(
                  claim: claim,
                  onVerify: _handleVerify,
                  onReject: _handleReject,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _onTapReceipt(BuildContext context) async {
    if (claim.fileUrl == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No receipt attached')),
      );
      return;
    }
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          child: InteractiveViewer(
            child: Image.network(
              claim.fileUrl!,
              fit: BoxFit.contain,
            ),
          ),
        );
      },
    );
  }

  Future<void> _handleVerify(BuildContext context) async {
    final ok = await _confirm(context, 'Verify this claim?');
    if (ok && mounted) {
      // TODO: Implement actual verification API call
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Claim verified')));
    }
  }

  Future<void> _handleReject(BuildContext context) async {
    final reason = await _rejectSheet(context);
    if (reason != null && mounted) {
      // TODO: Implement actual rejection API call
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Claim rejected${reason.isNotEmpty ? ': $reason' : ''}',
          ),
        ),
      );
    }
  }

  Future<bool> _confirm(BuildContext context, String message) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm'),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('No'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            style: FilledButton.styleFrom(
              backgroundColor: const Color(0xFF160C52),
            ),
            child: const Text('Yes'),
          ),
        ],
      ),
    );
    return result ?? false;
  }

  Future<String?> _rejectSheet(BuildContext context) async {
    final controller = TextEditingController();
    final result = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            left: 16,
            right: 16,
            top: 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Reject Claim',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: controller,
                maxLines: 4,
                minLines: 3,
                decoration: const InputDecoration(
                  hintText: 'Reason (optional)',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel'),
                  ),
                  const Spacer(),
                  FilledButton(
                    onPressed: () =>
                        Navigator.pop<String>(context, controller.text),
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF160C52),
                    ),
                    child: const Text('Reject'),
                  ),
                ],
              )
            ],
          ),
        );
      },
    );
    return result;
  }
}

class _VerificationCard extends StatelessWidget {
  final Claim claim;
  final Future<void> Function(BuildContext) onVerify;
  final Future<void> Function(BuildContext) onReject;

  const _VerificationCard({
    required this.claim,
    required this.onVerify,
    required this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF1F2F4),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          KvRow(label: 'Employee Name', value: Text(claim.employeeName ?? 'Unknown')),
          KvRow(label: 'Expense Type', value: Text(claim.expenseTypeName ?? 'Unknown')),
          KvRow(
            label: 'LPO Number',
            value: Text(claim.billNumber ?? '—',
                style: const TextStyle(color: Color(0xFF6B7280))),
          ),
          KvRow(label: 'Bill Date', value: Text(claim.formattedBillDate)),
          KvRow(
              label: 'Bill Amount',
              value: Text(claim.amount.toStringAsFixed(2))),
          KvRow(
            label: 'Engineer Approval',
            value: StatusChip(status: claim.engineerStatus),
          ),
          KvRow(
            label: 'HO Approval',
            value: StatusChip(status: claim.hoStatus),
          ),
          KvRow(label: 'Submitted Date', value: Text(claim.formattedSubmittedDate)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: claim.status == ClaimStatus.approved
                      ? null
                      : () => onVerify(context),
                  icon: const Icon(Icons.check_rounded),
                  label: const Text('Verify'),
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF160C52),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: FilledButton.icon(
                  onPressed: claim.status == ClaimStatus.rejected
                      ? null
                      : () => onReject(context),
                  icon: const Icon(Icons.close_rounded),
                  label: const Text('Reject'),
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF160C52),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
