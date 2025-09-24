# Bill Blister Web Application

A modern web application built with Next.js and React that replicates the functionality of the Bill Blister Flutter mobile app. This application provides a comprehensive expense management and claim processing system for companies.

## Features

### 🏢 Amount Allocation Management
- Track and manage cash allocations to employees
- Grid/list view with employee details and filtering
- Real-time total cash issued calculation
- Responsive design for mobile, tablet, and desktop

### 📋 Expense Claim System
- Create new expense claims with comprehensive forms
- Support for multiple expense types (Food, Travel, Office Supplies, etc.)
- LPO (Local Purchase Order) number assignment
- Receipt attachment system (Camera, Gallery, Files)
- Form validation with real-time feedback

### ✅ Claim Verification Workflow
- Engineer-level approval process
- Receipt preview with zoom functionality
- Approve/Reject actions with confirmation
- Rejection reason input
- Status tracking and visual indicators

### 🔔 Notifications System
- Real-time notifications for claim updates
- Status-based notification categorization
- Unread notification tracking

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom components with Heroicons
- **Form Handling**: React Hook Form with Yup validation
- **Icons**: Heroicons and Lucide React

## Design System

The application follows the exact design system from the Flutter app:

### Colors
- **Primary Navy**: #1A1B3A
- **Navy Light**: #2D2E5A
- **Navy Dark**: #0F0F2A
- **Status Colors**: Success (#10B981), Warning (#F59E0B), Error (#EF4444), Info (#3B82F6)

### Typography
- **Headlines**: 32px/28px/24px with varying weights
- **Titles**: 20px/16px/14px with 600 weight
- **Body**: 16px/14px/12px with 400 weight
- **Labels**: 14px/12px/10px with 500 weight

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bill-blister-web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── amount-allocation/  # Amount allocation management
│   ├── expense-claim/      # Expense claim system
│   ├── claim-verification/ # Claim verification workflow
│   ├── claim-approval/     # Claim approval (placeholder)
│   ├── notifications/      # Notifications system
│   └── add-allocation/     # Add new allocation form
├── components/             # Reusable UI components
│   ├── layout/            # Layout components (Header, Sidebar)
│   └── ui/                # UI components (StatusChip, InfoRow, etc.)
├── data/                  # Mock data and utilities
├── styles/                # Global styles and CSS
└── types/                 # TypeScript type definitions
```

## Key Features Implemented

### ✅ Completed Features
- [x] Responsive design system matching Flutter app
- [x] Amount allocation viewing and management
- [x] Expense claim creation with full form validation
- [x] Receipt attachment system with file upload
- [x] Claim verification workflow with approve/reject
- [x] Navigation system with sidebar and routing
- [x] Status management with visual indicators
- [x] Empty states and loading states
- [x] Form validation and error handling
- [x] Mock data integration

### 🔄 Placeholder Features
- [ ] Claim approval (HO level) - shows empty state
- [ ] Backend API integration - currently using mock data
- [ ] Real-time notifications
- [ ] User authentication

## Usage

### Amount Allocation
- View all cash allocations with filtering options
- See total cash issued across all allocations
- Filter by employee name and expense type

### Expense Claims
- Create new expense claims with detailed forms
- Upload receipt images or PDF files
- View claim status and history
- Filter claims by status (pending, approved, rejected)

### Claim Verification
- Review pending claims for engineer approval
- Preview receipt attachments
- Approve or reject claims with reasons
- Track verification status

## Development

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for consistent styling
- Component-based architecture

### Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (≤768px), Tablet (≥768px), Desktop (≥1024px)
- Touch-friendly interface
- Optimized for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Bill Blister application suite.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.