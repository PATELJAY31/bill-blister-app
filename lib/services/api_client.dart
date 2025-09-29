import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiClient {
  static const String baseUrl = 'http://localhost:3001/api';
  static String? _authToken;

  static void setAuthToken(String token) {
    _authToken = token;
  }

  static void clearAuthToken() {
    _authToken = null;
  }

  static Map<String, String> get _headers {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    
    return headers;
  }

  // GET request
  static Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, String>? queryParams,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final uriWithParams = queryParams != null 
          ? uri.replace(queryParameters: queryParams)
          : uri;

      final response = await http.get(
        uriWithParams,
        headers: _headers,
      );

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>.error('Network error: ${e.toString()}');
    }
  }

  // POST request
  static Future<ApiResponse<T>> post<T>(
    String endpoint, {
    Map<String, dynamic>? body,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      );

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>.error('Network error: ${e.toString()}');
    }
  }

  // PUT request
  static Future<ApiResponse<T>> put<T>(
    String endpoint, {
    Map<String, dynamic>? body,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
        body: body != null ? jsonEncode(body) : null,
      );

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>.error('Network error: ${e.toString()}');
    }
  }

  // DELETE request
  static Future<ApiResponse<T>> delete<T>(
    String endpoint, {
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: _headers,
      );

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>.error('Network error: ${e.toString()}');
    }
  }

  // File upload
  static Future<ApiResponse<T>> uploadFile<T>(
    String endpoint,
    File file, {
    String fieldName = 'file',
    Map<String, String>? additionalFields,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final request = http.MultipartRequest('POST', Uri.parse('$baseUrl$endpoint'));
      
      // Add headers
      request.headers.addAll(_headers);
      request.headers.remove('Content-Type'); // Let multipart set it

      // Add file
      request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));

      // Add additional fields
      if (additionalFields != null) {
        request.fields.addAll(additionalFields);
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse<T>.error('File upload error: ${e.toString()}');
    }
  }

  static ApiResponse<T> _handleResponse<T>(
    http.Response response,
    T Function(Map<String, dynamic>)? fromJson,
  ) {
    final statusCode = response.statusCode;
    final body = response.body;

    if (statusCode >= 200 && statusCode < 300) {
      try {
        final jsonData = jsonDecode(body);
        
        if (fromJson != null) {
          final data = fromJson(jsonData);
          return ApiResponse<T>.success(data);
        } else {
          return ApiResponse<T>.success(jsonData as T);
        }
      } catch (e) {
        return ApiResponse<T>.error('JSON parsing error: ${e.toString()}');
      }
    } else {
      try {
        final errorData = jsonDecode(body);
        final message = errorData['message'] ?? 'Unknown error occurred';
        return ApiResponse<T>.error('$message (Status: $statusCode)');
      } catch (e) {
        return ApiResponse<T>.error('HTTP $statusCode: ${response.reasonPhrase}');
      }
    }
  }
}

class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;

  ApiResponse._({
    required this.success,
    this.data,
    this.error,
  });

  factory ApiResponse.success(T data) {
    return ApiResponse._(success: true, data: data);
  }

  factory ApiResponse.error(String error) {
    return ApiResponse._(success: false, error: error);
  }
}
