# Bill Blister Backend Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v12 or higher)
3. **npm** or **yarn**

## Quick Setup

### 1. Install Dependencies
```bash
cd bill-blister-backend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/bill_blister_db?schema=public"

# JWT Configuration
JWT_SECRET="bill-blister-super-secret-jwt-key-2024"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3001
NODE_ENV="development"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL with Docker
docker run --name bill-blister-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bill_blister_db \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Local PostgreSQL Installation
1. Install PostgreSQL locally
2. Create database: `createdb bill_blister_db`
3. Update DATABASE_URL in .env file

### 4. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Expense Types
- `GET /api/expense-types` - Get all expense types
- `POST /api/expense-types` - Create expense type
- `PUT /api/expense-types/:id` - Update expense type
- `DELETE /api/expense-types/:id` - Delete expense type

### Allocations
- `GET /api/allocations` - Get all allocations
- `POST /api/allocations` - Create allocation
- `GET /api/allocations/:id` - Get allocation by ID
- `PUT /api/allocations/:id` - Update allocation
- `DELETE /api/allocations/:id` - Delete allocation

### Claims
- `GET /api/claims` - Get all claims
- `POST /api/claims` - Create claim
- `GET /api/claims/:id` - Get claim by ID
- `PUT /api/claims/:id` - Update claim
- `DELETE /api/claims/:id` - Delete claim
- `POST /api/claims/:id/verify` - Verify claim (Engineer)
- `POST /api/claims/:id/approve` - Approve claim (HO Approver)

## Sample Data

The database will be seeded with:
- 4 sample users (Admin, Employee, Engineer, HO Approver)
- 6 expense types
- Sample allocations and claims
- Sample notifications

### Demo Credentials
- **Admin**: `admin@billblister.com` / `password123`
- **Employee**: `employee@billblister.com` / `password123`
- **Engineer**: `engineer@billblister.com` / `password123`
- **HO Approver**: `approver@billblister.com` / `password123`

## Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Database Management
- Use `npm run db:studio` to open Prisma Studio for database management
- Use `npm run db:push` for schema changes during development
- Use `npm run db:migrate` for production deployments

## Production Deployment

1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL database
3. Set secure JWT secret
4. Configure proper CORS origins
5. Set up file storage (Firebase/S3)
6. Configure email service for notifications

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process using the port

3. **JWT Secret Error**
   - Ensure JWT_SECRET is set in .env file
   - Use a strong, random secret key

4. **CORS Issues**
   - Check CORS_ORIGIN in .env file
   - Ensure frontend URL matches CORS configuration

## Support

For issues and questions:
- Check the logs for error details
- Verify environment variables
- Ensure all dependencies are installed
- Check database connectivity
