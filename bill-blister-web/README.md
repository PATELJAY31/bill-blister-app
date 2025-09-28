# Bill Blister Web Application

A comprehensive expense management system built with Next.js, TypeScript, and Tailwind CSS. This web application replicates and enhances the features available in the BillBitzer system, providing a modern, responsive interface for managing employee expense claims, cash allocations, and approval workflows.

## 🚀 Features

### ✅ Implemented Features

- **Authentication & Role-Based Access**
  - Login/Logout with JWT tokens
  - Role-based navigation (Admin, Employee, Engineer, HO Approver)
  - Protected routes and middleware

- **Dashboard & Analytics**
  - Overview cards with key metrics
  - Interactive charts and graphs
  - Recent activity feed
  - Real-time statistics

- **Amount Allocation Management**
  - Create, view, edit, and delete allocations
  - Advanced filtering and search
  - Status tracking and management
  - Total amount calculations

- **Expense Claim System**
  - Comprehensive claim submission
  - File upload support (images/PDFs)
  - Status tracking and history
  - Advanced filtering and search

- **Claim Verification Workflow**
  - Engineer-level verification
  - Approve/Reject with notes
  - Receipt preview functionality
  - Status updates and notifications

- **Modern UI/UX**
  - Responsive design for all devices
  - Smooth animations with Framer Motion
  - Professional design system
  - Dark/Light theme support
  - Loading states and error handling

### 🔄 In Progress Features

- **Claim Approval (HO Level)**
- **Employee Management**
- **Expense Type Management**
- **Reports & Analytics**
- **Real-time Notifications**
- **File Upload Integration**

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.0
- **Animations**: Framer Motion 12.23.22
- **State Management**: Zustand 5.0.2
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts 2.12.7
- **Icons**: Heroicons 2.1.1
- **Notifications**: React Hot Toast 2.4.1

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bill-blister-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=Bill Blister
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Credentials

The application includes demo credentials for testing different user roles:

- **Admin**: `admin@billblister.com` / `password123`
- **Employee**: `employee@billblister.com` / `password123`
- **Engineer**: `engineer@billblister.com` / `password123`
- **HO Approver**: `approver@billblister.com` / `password123`

## 📱 Pages & Features

### Authentication
- **Login Page** (`/login`) - User authentication with role-based access
- **Signup Page** (`/signup`) - New user registration (Admin controlled)

### Main Application
- **Dashboard** (`/dashboard`) - Overview with analytics and recent activity
- **Amount Allocation** (`/allocations`) - Manage cash allocations to employees
- **Expense Claims** (`/claims`) - Submit and manage expense claims
- **Claim Verification** (`/verification`) - Engineer-level claim verification
- **Claim Approval** (`/approval`) - HO-level claim approval
- **Employee Management** (`/employees`) - Manage employee data and roles
- **Expense Types** (`/expense-types`) - Configure expense categories
- **Reports** (`/reports`) - Analytics and reporting dashboard
- **Notifications** (`/notifications`) - System notifications and alerts
- **Settings** (`/settings`) - Application configuration

## 🎨 Design System

### Colors
- **Primary Navy**: #1A1B3A
- **Navy Light**: #2D2E5A
- **Navy Dark**: #0F0F2A
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444
- **Info**: #3B82F6

### Typography
- **Font Family**: Inter
- **Headings**: 32px/28px/24px with varying weights
- **Body**: 16px/14px/12px with 400 weight
- **Labels**: 14px/12px/10px with 500 weight

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants with hover states
- **Forms**: Consistent styling with validation
- **Status Chips**: Color-coded status indicators
- **Modals**: Smooth animations and backdrop blur

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── allocations/        # Allocation management
│   ├── claims/             # Claim management
│   ├── verification/       # Claim verification
│   ├── approval/           # Claim approval
│   ├── employees/          # Employee management
│   ├── expense-types/      # Expense type management
│   ├── reports/            # Reports and analytics
│   ├── notifications/      # Notifications
│   ├── settings/           # Settings
│   ├── login/              # Authentication
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # Basic UI components
│   └── layout/             # Layout components
├── store/                  # State management
├── types/                  # TypeScript type definitions
├── lib/                    # Utility functions
└── styles/                 # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict mode enabled
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for quality checks (optional)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Static site generation
- **Railway**: Full-stack deployment
- **AWS**: EC2 or Lambda deployment
- **Docker**: Containerized deployment

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Granular permissions
- **CSRF Protection**: Built-in Next.js protection
- **XSS Prevention**: Content Security Policy
- **Input Validation**: Client and server-side validation
- **Rate Limiting**: API request throttling

## 📊 Performance

- **Next.js Optimization**: Automatic code splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack bundle analyzer
- **Lazy Loading**: Component and route-based
- **Caching**: Static and dynamic caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Roadmap

### Phase 1 (Current)
- [x] Authentication system
- [x] Dashboard and analytics
- [x] Allocation management
- [x] Claim submission
- [x] Verification workflow

### Phase 2 (Next)
- [ ] Claim approval workflow
- [ ] Employee management
- [ ] Expense type management
- [ ] File upload integration
- [ ] Real-time notifications

### Phase 3 (Future)
- [ ] Advanced reporting
- [ ] Mobile app integration
- [ ] API documentation
- [ ] Performance optimization
- [ ] Internationalization

---

**Built with ❤️ by the Bill Blister Team**