import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../utils/constants.dart';
import '../../utils/nav_utils.dart';
import '../widgets/app_drawer.dart';
import '../widgets/filter_sheet.dart';
import 'package:flutter/services.dart';

class AppShell extends StatefulWidget {
  final String title;
  final Widget body;
  final bool showPlus;
  final bool showFilter;
  final bool showBell;
  final VoidCallback? onPlusPressed;

  const AppShell({
    super.key,
    required this.title,
    required this.body,
    this.showPlus = true,
    this.showFilter = true,
    this.showBell = true,
    this.onPlusPressed,
  });

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  DateTime? _lastBackPressedAt;

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        key: _scaffoldKey,
        drawer: const AppDrawer(),
        appBar: _buildCustomNavyAppBar(context),
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: widget.body,
          ),
        ),
      ),
    );
  }

  Future<bool> _onWillPop() async {
    // 1) Close drawer if open
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
      return false;
    }

    // 2) Pop if possible
    final NavigatorState nav = Navigator.of(context);
    if (nav.canPop()) {
      nav.maybePop();
      return false;
    }

    // 3) Double press to exit
    final allow = NavUtils.handleRootBack(
      context: context,
      lastBackPressedAt: _lastBackPressedAt,
      updateLastBackPressed: (t) => _lastBackPressedAt = t,
    );
    return allow;
  }

  Future<void> _handleBackButtonTap() async {
    // Mirror system back behavior, and exit on confirmed second tap at root
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
      return;
    }

    final NavigatorState nav = Navigator.of(context);
    if (nav.canPop()) {
      nav.maybePop();
      return;
    }

    final allow = NavUtils.handleRootBack(
      context: context,
      lastBackPressedAt: _lastBackPressedAt,
      updateLastBackPressed: (t) => _lastBackPressedAt = t,
    );
    if (allow) {
      SystemNavigator.pop();
    }
  }

  PreferredSizeWidget _buildCustomNavyAppBar(BuildContext context) {
    return PreferredSize(
      preferredSize: const Size.fromHeight(72),
      child: Container(
        height: 72,
        decoration: const BoxDecoration(
          color: navy,
          borderRadius: BorderRadius.only(
            bottomLeft: Radius.circular(12),
            bottomRight: Radius.circular(12),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              blurRadius: 12,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Leftmost: hamburger menu
              Builder(builder: (inner) {
                return IconButton(
                  onPressed: () {
                    Scaffold.of(inner).openDrawer();
                  },
                  icon: const Icon(
                    Icons.menu_rounded,
                    color: onNavy,
                    size: 24,
                  ),
                );
              }),

              // Back arrow next to hamburger
              IconButton(
                onPressed: _handleBackButtonTap,
                icon: const Icon(
                  Icons.arrow_back_rounded,
                  color: onNavy,
                  size: 24,
                ),
              ),

              // Centered title
              Expanded(
                child: Text(
                  '${widget.title} | $companyName',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: onNavy,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),

              // Right actions: optional actions (no hamburger here)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (widget.showBell)
                    IconButton(
                      onPressed: () {
                        Navigator.pushNamed(context, '/notifications');
                      },
                      icon: const Icon(
                        Icons.notifications_none_rounded,
                        color: onNavy,
                        size: 24,
                      ),
                    ),
                  if (widget.showPlus)
                    IconButton(
                      onPressed: () {
                        if (widget.onPlusPressed != null) {
                          widget.onPlusPressed!.call();
                        } else {
                          Navigator.pushNamed(context, '/add-allocation');
                        }
                      },
                      icon: const Icon(
                        Icons.add_rounded,
                        color: onNavy,
                        size: 24,
                      ),
                    ),
                  if (widget.showFilter)
                    IconButton(
                      onPressed: () {
                        _showFilterBottomSheet(context);
                      },
                      icon: const Icon(
                        Icons.tune_rounded,
                        color: onNavy,
                        size: 24,
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

  void _showFilterBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => const FilterSheet(),
    );
  }
}
