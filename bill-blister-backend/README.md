# Bill Blister Backend API

A comprehensive backend API for the Bill Blister App - an Expense & Claim Management System built with Node.js, Express, MySQL, Prisma ORM, and Firebase Storage.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Employee Management**: Complete CRUD operations for employee data
- **Expense Type Management**: Manage expense categories and types
- **Allocation & Claims**: Handle expense allocations and approval workflows
- **File Uploads**: Firebase Storage integration for receipts and documents
- **Notifications**: Real-time notification system
- **Reporting**: Comprehensive reporting and analytics
- **Head Management**: Manage Head1 and Head2 organizational structures
- **Role-based Access**: Employee, Engineer, HO Approver, and Admin roles

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Firebase Admin SDK
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: express-validator
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
bill-blister-backend/
├── src/
│   ├── config/           # Database and Firebase configuration
│   ├── controllers/      # Business logic controllers
│   ├── middlewares/      # Authentication, validation, error handling
│   ├── routes/          # Express route definitions
│   └── index.js         # Main server file
├── prisma/
│   └── schema.prisma    # Database schema
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- Firebase project with Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bill-blister-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DATABASE_URL="mysql://username:password@localhost:3306/bill_blister_db"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Firebase
   FIREBASE_PROJECT_ID="your-firebase-project-id"
   FIREBASE_PRIVATE_KEY="your-firebase-private-key"
   FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed database (optional)
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Database Schema

### Core Tables

- **Employee**: User accounts with roles and personal information
- **ExpenseType**: Categories for different types of expenses
- **Head1/Head2**: Organizational hierarchy levels
- **Allocation**: Expense allocations and claims
- **Notification**: User notifications

### Key Relationships

- Employee → Allocation (One-to-Many)
- ExpenseType → Allocation (One-to-Many)
- Employee → Employee (Self-referencing for reporting manager)

## 🔐 Authentication & Authorization

### Roles

- **EMPLOYEE**: Can create and manage their own allocations
- **ENGINEER**: Can verify allocations (approve/reject)
- **APPROVER**: Can approve allocations after engineer verification
- **ADMIN**: Full system access

### JWT Token

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Employees
- `GET /api/employees` - Get all employees (with pagination)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/:id` - Update employee (Admin only)
- `DELETE /api/employees/:id` - Delete employee (Admin only)
- `GET /api/employees/stats` - Get employee statistics

### Expense Types
- `GET /api/expense-types` - Get all expense types
- `GET /api/expense-types/:id` - Get expense type by ID
- `POST /api/expense-types` - Create expense type (Admin only)
- `PUT /api/expense-types/:id` - Update expense type (Admin only)
- `DELETE /api/expense-types/:id` - Delete expense type (Admin only)
- `PATCH /api/expense-types/:id/toggle-status` - Toggle status (Admin only)

### Allocations/Claims
- `GET /api/allocations` - Get all allocations (with pagination)
- `GET /api/allocations/:id` - Get allocation by ID
- `POST /api/allocations` - Create allocation (with file upload)
- `PUT /api/allocations/:id` - Update allocation
- `DELETE /api/allocations/:id` - Delete allocation
- `PUT /api/allocations/:id/verify` - Engineer verification
- `PUT /api/allocations/:id/approve` - HO approval
- `GET /api/allocations/stats` - Get allocation statistics

### Heads
- `GET /api/heads/head1` - Get Head1 list
- `GET /api/heads/head2` - Get Head2 list
- `POST /api/heads/head1` - Create Head1 (Admin only)
- `POST /api/heads/head2` - Create Head2 (Admin only)
- `PUT /api/heads/head1/:id` - Update Head1 (Admin only)
- `PUT /api/heads/head2/:id` - Update Head2 (Admin only)
- `DELETE /api/heads/head1/:id` - Delete Head1 (Admin only)
- `DELETE /api/heads/head2/:id` - Delete Head2 (Admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/:id` - Get notification by ID
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications` - Create notification (Admin only)

### Reports
- `GET /api/reports/allocations` - Allocation reports
- `GET /api/reports/claims` - Claim reports
- `GET /api/reports/employees` - Employee reports
- `GET /api/reports/expense-types` - Expense type reports
- `GET /api/reports/dashboard` - Dashboard statistics

## 📁 File Uploads

The API supports file uploads through Firebase Storage:

- **Supported formats**: JPEG, PNG, GIF, PDF
- **Max file size**: 10MB (configurable)
- **Upload endpoint**: Include file in `POST /api/allocations`
- **File field name**: `file`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | Required |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | Required |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | Required |
| `CORS_ORIGIN` | Allowed origins | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `MAX_FILE_SIZE` | Max file upload size | `10485760` (10MB) |
| `ALLOWED_FILE_TYPES` | Allowed file types | `image/jpeg,image/png,image/gif,application/pdf` |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start src/index.js --name "bill-blister-api"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup

1. Set up MySQL database
2. Configure Firebase project
3. Set environment variables
4. Run database migrations
5. Deploy application

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // For paginated responses
}
```

### Error Format

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

### Pagination

Paginated endpoints support these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Sort field
- `sortOrder`: Sort direction (asc/desc)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete CRUD operations for all entities
- JWT authentication and authorization
- Firebase file upload integration
- Comprehensive reporting system
- Role-based access control