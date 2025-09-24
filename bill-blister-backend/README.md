# Bill Blister Backend API

A comprehensive backend API for the Bill Blister expense management application, built with Node.js, Express, PostgreSQL, and Prisma.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **Employee Management**: Complete CRUD operations for employee data
- **Expense Type Management**: Manage different types of expenses
- **Allocation System**: Track cash allocations to employees
- **Claim Processing**: Submit, verify, and approve expense claims
- **File Upload**: Firebase Storage integration for receipt attachments
- **Role-based Authorization**: Employee, Engineer, HO Approver, and Admin roles
- **RESTful API**: Clean and well-documented API endpoints
- **Data Validation**: Comprehensive input validation and error handling
- **Rate Limiting**: Built-in rate limiting for API protection

## 🛠 Tech Stack

- **Backend Framework**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Firebase Storage
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **Environment**: dotenv

## 📂 Project Structure

```
bill-blister-backend/
├── src/
│   ├── config/           # Database and Firebase configuration
│   ├── controllers/      # Business logic controllers
│   ├── middlewares/      # Authentication, validation, error handling
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions and helpers
│   └── index.js         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json
├── env.example          # Environment variables template
└── README.md
```

## 🗄 Database Schema

### Core Models

- **Employee**: User accounts with role-based access
- **ExpenseType**: Different categories of expenses
- **Allocation**: Cash allocations to employees
- **Claim**: Expense claims with approval workflow
- **Notification**: System notifications for users

### Key Relationships

- Employees can have reporting managers (self-referencing)
- Allocations belong to employees and expense types
- Claims belong to employees, expense types, and optionally allocations
- Claims can be verified by engineers and approved by HO approvers

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Firebase project with Storage enabled

### 1. Clone and Install

```bash
git clone <repository-url>
cd bill-blister-backend
npm install
```

### 2. Environment Configuration

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/bill_blister_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# Firebase Configuration
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Firebase Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - User login
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - Logout user

#### Employees (`/api/employees`)
- `GET /` - Get all employees (with pagination)
- `GET /stats` - Get employee statistics
- `GET /:id` - Get employee by ID
- `POST /` - Create employee (Admin only)
- `PUT /:id` - Update employee (Admin only)
- `DELETE /:id` - Delete employee (Admin only)

#### Expense Types (`/api/expense-types`)
- `GET /` - Get all expense types
- `GET /active` - Get active expense types
- `GET /stats` - Get expense type statistics
- `GET /:id` - Get expense type by ID
- `POST /` - Create expense type (Admin only)
- `PUT /:id` - Update expense type (Admin only)
- `PATCH /:id/toggle-status` - Toggle status (Admin only)
- `DELETE /:id` - Delete expense type (Admin only)

#### Allocations (`/api/allocations`)
- `GET /` - Get all allocations
- `GET /stats` - Get allocation statistics
- `GET /:id` - Get allocation by ID
- `POST /` - Create allocation (Admin only)
- `PUT /:id` - Update allocation (Admin only)
- `DELETE /:id` - Delete allocation (Admin only)

#### Claims (`/api/claims`)
- `GET /` - Get all claims
- `GET /stats` - Get claim statistics
- `GET /:id` - Get claim by ID
- `POST /` - Create claim
- `PUT /:id/verify` - Verify claim (Engineer only)
- `PUT /:id/approve` - Approve claim (HO Approver only)
- `PUT /:id` - Update claim (Owner only)
- `DELETE /:id` - Delete claim (Owner only)

### Query Parameters

Most list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `sortBy` - Sort field
- `sortOrder` - Sort direction (asc/desc)

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

## 🔐 User Roles

### Employee
- Create and manage own expense claims
- View own allocations and claims
- Update own profile

### Engineer
- Verify expense claims
- View all claims and allocations
- All Employee permissions

### HO Approver
- Approve verified claims
- View all claims and allocations
- All Employee permissions

### Admin
- Full system access
- Manage employees, expense types, allocations
- All other role permissions

## 📁 File Upload

The API supports file uploads for receipts and documents:

- **Supported formats**: JPEG, PNG, GIF, PDF
- **Maximum file size**: 10MB
- **Storage**: Firebase Storage
- **Endpoints**: Allocations and Claims creation/update

## 🧪 Testing

### Sample Data

The seed script creates sample data including:

- **Users**: Admin, Engineer, HO Approver, and Employee accounts
- **Expense Types**: Food, Travel, Office Supplies, etc.
- **Allocations**: Sample cash allocations
- **Claims**: Sample expense claims with different statuses
- **Notifications**: Sample system notifications

### Test Accounts

```
Admin: admin@billblister.com / password123
Engineer: john.engineer@billblister.com / password123
HO Approver: jane.approver@billblister.com / password123
Employee: saloni.jadav@billblister.com / password123
```

## 🚀 Deployment

### Environment Variables for Production

Ensure all environment variables are set in your production environment:

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
JWT_SECRET=your-production-jwt-secret
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
CORS_ORIGIN=your-frontend-url
```

### Database Migration

```bash
# Generate migration
npm run db:migrate

# Deploy to production
npm run db:push
```

### Recommended Hosting

- **Backend**: Render, Railway, Heroku, or AWS
- **Database**: Supabase, PlanetScale, or AWS RDS
- **File Storage**: Firebase Storage

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm start            # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with sample data
npm test             # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Code Structure

- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and middleware
- **Middlewares**: Authentication, validation, error handling
- **Utils**: Helper functions for JWT, passwords, file uploads
- **Config**: Database and Firebase configuration

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Firebase Upload Error**
   - Check Firebase project configuration
   - Verify service account credentials
   - Ensure Firebase Storage is enabled

3. **JWT Token Error**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Check token expiration

4. **CORS Error**
   - Update CORS_ORIGIN in environment
   - Check frontend URL configuration

### Logs

The application logs important events and errors. Check the console output for:
- Database connection status
- Server startup messages
- Error details and stack traces

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the troubleshooting section

---

**Bill Blister Backend API** - Built with ❤️ for efficient expense management
