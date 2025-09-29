import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/employee.dart';
import 'api_client.dart';

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'current_user';
  
  static Employee? _currentUser;
  static String? _token;

  // Initialize auth state from storage
  static Future<void> initialize() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    
    final userJson = prefs.getString(_userKey);
    if (userJson != null) {
      try {
        final userData = jsonDecode(userJson);
        _currentUser = Employee.fromJson(userData);
        ApiClient.setAuthToken(_token!);
      } catch (e) {
        // Clear invalid data
        await clearAuth();
      }
    }
  }

  // Login
  static Future<AuthResult> login(String email, String password) async {
    try {
      final response = await ApiClient.post<Map<String, dynamic>>(
        '/auth/login',
        body: {
          'email': email,
          'password': password,
        },
      );

      if (response.success && response.data != null) {
        final data = response.data!;
        _token = data['token'];
        _currentUser = Employee.fromJson(data['user']);
        
        // Save to storage
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_tokenKey, _token!);
        await prefs.setString(_userKey, jsonEncode(data['user']));
        
        ApiClient.setAuthToken(_token!);
        
        return AuthResult.success(_currentUser!);
      } else {
        return AuthResult.error(response.error ?? 'Login failed');
      }
    } catch (e) {
      return AuthResult.error('Network error: ${e.toString()}');
    }
  }

  // Logout
  static Future<void> logout() async {
    await clearAuth();
  }

  // Clear authentication data
  static Future<void> clearAuth() async {
    _currentUser = null;
    _token = null;
    ApiClient.clearAuthToken();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  // Get current user
  static Employee? get currentUser => _currentUser;

  // Check if user is logged in
  static bool get isLoggedIn => _currentUser != null && _token != null;

  // Get auth token
  static String? get token => _token;

  // Update user profile
  static Future<AuthResult> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
    String? phone,
    String? country,
    String? state,
    String? city,
    String? fullAddress1,
    String? fullAddress2,
  }) async {
    if (_currentUser == null) {
      return AuthResult.error('No user logged in');
    }

    try {
      final response = await ApiClient.put<Map<String, dynamic>>(
        '/auth/profile',
        body: {
          if (firstName != null) 'firstName': firstName,
          if (lastName != null) 'lastName': lastName,
          if (email != null) 'email': email,
          if (phone != null) 'phone': phone,
          if (country != null) 'country': country,
          if (state != null) 'state': state,
          if (city != null) 'city': city,
          if (fullAddress1 != null) 'fullAddress1': fullAddress1,
          if (fullAddress2 != null) 'fullAddress2': fullAddress2,
        },
      );

      if (response.success && response.data != null) {
        _currentUser = Employee.fromJson(response.data!);
        
        // Update stored user data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_userKey, jsonEncode(response.data!));
        
        return AuthResult.success(_currentUser!);
      } else {
        return AuthResult.error(response.error ?? 'Profile update failed');
      }
    } catch (e) {
      return AuthResult.error('Network error: ${e.toString()}');
    }
  }

  // Change password
  static Future<AuthResult> changePassword(String currentPassword, String newPassword) async {
    try {
      final response = await ApiClient.put<Map<String, dynamic>>(
        '/auth/change-password',
        body: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
      );

      if (response.success) {
        return AuthResult.success(_currentUser!);
      } else {
        return AuthResult.error(response.error ?? 'Password change failed');
      }
    } catch (e) {
      return AuthResult.error('Network error: ${e.toString()}');
    }
  }
}

class AuthResult {
  final bool success;
  final Employee? user;
  final String? error;

  AuthResult._({
    required this.success,
    this.user,
    this.error,
  });

  factory AuthResult.success(Employee user) {
    return AuthResult._(success: true, user: user);
  }

  factory AuthResult.error(String error) {
    return AuthResult._(success: false, error: error);
  }
}
