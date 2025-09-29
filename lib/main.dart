import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'router/app_router.dart';
import 'services/auth_service.dart';
import 'services/allocation_state.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize auth service
  await AuthService.initialize();
  
  runApp(const UniMiskApp());
}

class UniMiskApp extends StatelessWidget {
  const UniMiskApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AllocationState()),
      ],
      child: MaterialApp(
        title: 'UniMisk ERP',
        theme: lightTheme(),
        initialRoute: AppRouter.initialRoute,
        routes: AppRouter.routes,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
