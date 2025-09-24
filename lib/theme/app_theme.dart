import 'package:flutter/material.dart';

// Design System Colors - Enhanced Palette
const Color navy = Color(0xFF1A1B3A);
const Color navyLight = Color(0xFF2D2E5A);
const Color navyDark = Color(0xFF0F0F2A);
const Color onNavy = Colors.white;
const Color onNavySecondary = Color(0xFFE8E9F0);

// Text Colors
const Color textPrimary = Color(0xFF1A1B3A);
const Color textSecondary = Color(0xFF6B7280);
const Color textTertiary = Color(0xFF9CA3AF);
const Color textDisabled = Color(0xFFD1D5DB);

// Status Colors
const Color success = Color(0xFF10B981);
const Color successLight = Color(0xFFD1FAE5);
const Color warning = Color(0xFFF59E0B);
const Color warningLight = Color(0xFFFEF3C7);
const Color error = Color(0xFFEF4444);
const Color errorLight = Color(0xFFFEE2E2);
const Color info = Color(0xFF3B82F6);
const Color infoLight = Color(0xFFDBEAFE);

// Surface Colors
const Color surface = Colors.white;
const Color surfaceSecondary = Color(0xFFF8F9FB);
const Color surfaceTertiary = Color(0xFFF1F2F4);
const Color surfaceElevated = Color(0xFFFFFFFF);

// Border & Divider Colors
const Color divider = Color(0xFFE5E7EB);
const Color dividerLight = Color(0xFFF3F4F6);
const Color border = Color(0xFFE5E7EB);
const Color borderLight = Color(0xFFF3F4F6);

// Interactive Colors
const Color chipBg = navy;
const Color chipText = Colors.white;
const Color chipBgSecondary = Color(0xFFF3F4F6);
const Color chipTextSecondary = textPrimary;

// Backward-compatible aliases
const Color primaryNavy = navy;
const Color muted = textSecondary;

ThemeData lightTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: navy,
      brightness: Brightness.light,
      primary: navy,
      secondary: navyLight,
      surface: surface,
      background: surfaceSecondary,
      error: error,
    ),

    // AppBar Theme - transparent background for custom styling
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.3,
        color: Colors.white,
      ),
      iconTheme: IconThemeData(
        color: Colors.white,
        size: 24,
      ),
    ),

    // Enhanced Text Theme
    textTheme: const TextTheme(
      // Headlines
      headlineLarge: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        color: textPrimary,
        letterSpacing: -0.5,
      ),
      headlineMedium: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: textPrimary,
        letterSpacing: -0.25,
      ),
      headlineSmall: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      
      // Titles
      titleLarge: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0.15,
      ),
      titleMedium: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0.1,
      ),
      titleSmall: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: textPrimary,
        letterSpacing: 0.1,
      ),
      
      // Body text
      bodyLarge: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: textPrimary,
        letterSpacing: 0.15,
      ),
      bodyMedium: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textSecondary,
        letterSpacing: 0.25,
      ),
      bodySmall: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: textTertiary,
        letterSpacing: 0.4,
      ),
      
      // Labels
      labelLarge: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: textPrimary,
        letterSpacing: 0.1,
      ),
      labelMedium: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: textSecondary,
        letterSpacing: 0.5,
      ),
      labelSmall: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.w500,
        color: textTertiary,
        letterSpacing: 0.5,
      ),
    ),

    // Enhanced Button Themes
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: navy,
        foregroundColor: Colors.white,
        elevation: 2,
        shadowColor: navy.withOpacity(0.3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    ),

    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: navy,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: navy,
        side: const BorderSide(color: border, width: 1.5),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    ),

    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: navy,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        textStyle: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
      ),
    ),

    // Enhanced Card Theme
    cardTheme: CardTheme(
      color: surface,
      elevation: 1,
      shadowColor: Colors.black.withOpacity(0.05),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: borderLight),
      ),
      margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
    ),

    // Input Decoration Theme
    inputDecorationTheme: InputDecorationTheme(
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
      ),
      hintStyle: const TextStyle(
        color: textTertiary,
        fontSize: 16,
        fontWeight: FontWeight.w400,
      ),
    ),

    // Divider Theme
    dividerTheme: const DividerThemeData(
      color: dividerLight,
      thickness: 1,
      space: 1,
    ),

    // Chip Theme
    chipTheme: ChipThemeData(
      backgroundColor: chipBgSecondary,
      selectedColor: navy,
      disabledColor: textDisabled,
      labelStyle: const TextStyle(
        color: textPrimary,
        fontSize: 14,
        fontWeight: FontWeight.w500,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    ),

    // Icon Theme
    iconTheme: const IconThemeData(
      color: textSecondary,
      size: 24,
    ),

    // Floating Action Button Theme
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: navy,
      foregroundColor: Colors.white,
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
      ),
    ),
  );
}
