# 🚀 Bill Blister - Quick Start Guide

Get the Bill Blister expense management system up and running in minutes!

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)

## Option 1: Using Docker (Recommended)

### 1. Start PostgreSQL with Docker
```bash
docker run --name bill-blister-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bill_blister_db \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Backend Setup
```bash
cd bill-blister-backend
npm run setup
```

### 3. Start Backend
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd ../bill-blister-web
npm install
npm run dev
```

## Option 2: Local PostgreSQL

### 1. Install PostgreSQL
- Install PostgreSQL locally
- Create database: `createdb bill_blister_db`
- Update DATABASE_URL in `bill-blister-backend/.env`

### 2. Backend Setup
```bash
cd bill-blister-backend
npm run setup
```

### 3. Start Backend
```bash
npm run dev
```

### 4. Frontend Setup
```bash
cd ../bill-blister-web
npm install
npm run dev
```

## 🎯 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Database Studio**: Run `npm run db:studio` in backend directory

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@billblister.com | password123 |
| **Employee** | employee@billblister.com | password123 |
| **Engineer** | engineer@billblister.com | password123 |
| **HO Approver** | approver@billblister.com | password123 |

## 🧪 Test the Application

1. **Login** with any of the demo credentials
2. **Explore the Dashboard** - View overview cards and charts
3. **Create a Claim** - Submit an expense claim
4. **Verify Claims** - Login as Engineer to verify claims
5. **Approve Claims** - Login as HO Approver to approve claims
6. **Manage Employees** - Add/edit employee information
7. **View Reports** - Generate and export reports

## 🔧 Troubleshooting

### Backend Issues
- **Database connection error**: Check if PostgreSQL is running
- **Port already in use**: Change PORT in `.env` file
- **JWT secret error**: Ensure JWT_SECRET is set in `.env`

### Frontend Issues
- **API connection error**: Check if backend is running on port 3001
- **Build errors**: Run `npm install` and check for missing dependencies
- **CORS errors**: Verify CORS_ORIGIN in backend `.env` file

### Common Solutions
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset database
cd bill-blister-backend
npm run db:push
npm run db:seed

# Check logs
npm run dev
```

## 📚 Next Steps

1. **Customize the application** for your needs
2. **Add your own data** by creating employees and expense types
3. **Configure file storage** for receipt uploads
4. **Set up email notifications** for status changes
5. **Deploy to production** when ready

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the [API documentation](bill-blister-backend/setup.md)
- Check the database schema in `bill-blister-backend/prisma/schema.prisma`
- Review the frontend components in `bill-blister-web/src/components/`

## 🎉 You're All Set!

The Bill Blister application is now running with:
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Expense claim management
- ✅ Approval workflow
- ✅ Employee management
- ✅ Reporting and analytics
- ✅ Real-time notifications
- ✅ File upload support

Enjoy managing your expenses! 🚀
