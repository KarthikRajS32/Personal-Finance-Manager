# Personal Finance Manager - Setup Guide

## Overview
This is a comprehensive Personal Finance Manager built with the MERN stack (MongoDB, Express.js, React, Node.js) that includes all the features you requested:

### ✅ Features Implemented
- **Expense Tracking**: Record, categorize, and filter expenses with charts
- **Budgeting**: Create budgets with real-time monitoring and alerts
- **Financial Planning**: Goal setting with progress tracking and forecasting
- **Financial Reports**: Comprehensive reports with charts and analytics
- **User Profiles**: Complete profile management with MFA support
- **Notifications**: Automated alerts for budgets, goals, and recurring expenses
- **Data Export**: CSV and PDF export functionality
- **Responsive Design**: Fully responsive across all devices
- **Security**: JWT authentication, MFA, data encryption

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

## Installation Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Setup
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/personal-finance-manager
JWT_SECRET=your-super-secret-jwt-key-here
PORT=8000
NODE_ENV=development
```

### 4. Start the Application

#### Backend (Terminal 1):
```bash
cd backend
npm start
```

#### Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Key Features & Usage

### 1. User Authentication & Profile
- **Registration/Login**: Secure authentication with JWT
- **Profile Management**: Personal info, preferences, notifications
- **Multi-Factor Authentication**: QR code setup with authenticator apps
- **Security Settings**: Password management and login tracking

### 2. Expense Tracking
- **Add Transactions**: Income and expense recording
- **Categories**: Custom category management
- **Filtering**: By date, category, amount, type
- **Analytics**: Visual charts and spending patterns

### 3. Budget Management
- **Create Budgets**: Monthly/yearly budgets by category
- **Real-time Monitoring**: Live budget usage tracking
- **Alerts**: Automatic notifications when approaching limits
- **Budget Reports**: Variance analysis and recommendations

### 4. Financial Goals
- **Goal Setting**: Target amounts with deadlines
- **Progress Tracking**: Visual progress indicators
- **Categories**: Savings, investment, purchase, debt, emergency
- **Achievement Notifications**: Celebrate completed goals

### 5. Financial Forecasting
- **Trend Analysis**: Income and expense trend calculations
- **Future Projections**: 6-36 month forecasts
- **Goal Feasibility**: Analysis of goal achievability
- **AI Recommendations**: Smart suggestions for financial improvement

### 6. Reports & Analytics
- **Expense Reports**: Detailed breakdowns with charts
- **Income Reports**: Income tracking and analysis
- **Budget Reports**: Performance vs. targets
- **Comprehensive Reports**: Complete financial overview

### 7. Notifications System
- **Real-time Alerts**: Budget limits, goal deadlines, recurring expenses
- **Notification Center**: Centralized notification management
- **Customizable**: User-controlled notification preferences
- **Priority Levels**: High, medium, low priority notifications

### 8. Data Export
- **CSV Export**: Transactions, budgets, goals
- **PDF Reports**: Formatted financial reports
- **Comprehensive Data**: Complete financial data export

### 9. Recurring Expenses
- **Automated Tracking**: Subscriptions, rent, utilities
- **Due Date Alerts**: Upcoming payment notifications
- **Frequency Options**: Daily, weekly, monthly, yearly

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/update-profile` - Update profile
- `POST /api/v1/users/setup-mfa` - Setup MFA
- `POST /api/v1/users/verify-mfa` - Verify MFA

### Transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions` - Get filtered transactions
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction

### Budgets
- `POST /api/v1/budgets` - Create budget
- `GET /api/v1/budgets` - Get user budgets
- `PUT /api/v1/budgets/:id` - Update budget
- `DELETE /api/v1/budgets/:id` - Delete budget

### Goals
- `POST /api/v1/goals` - Create goal
- `GET /api/v1/goals` - Get user goals
- `PUT /api/v1/goals/:id` - Update goal
- `DELETE /api/v1/goals/:id` - Delete goal

### Reports
- `GET /api/v1/reports/expense` - Expense report
- `GET /api/v1/reports/income` - Income report
- `GET /api/v1/reports/budget` - Budget report
- `GET /api/v1/reports/comprehensive` - Comprehensive report
- `GET /api/v1/reports/forecast` - Financial forecast

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Speakeasy**: MFA implementation
- **node-cron**: Scheduled tasks
- **json2csv**: CSV export
- **pdfkit**: PDF generation

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **TailwindCSS**: Styling
- **React Query**: Data fetching
- **Redux Toolkit**: State management
- **Chart.js**: Data visualization
- **Formik**: Form handling
- **Yup**: Form validation
- **React Router**: Navigation

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Multi-factor authentication (MFA)
- Input validation and sanitization
- CORS protection
- Rate limiting ready
- Secure headers

## Performance Features
- React Query for efficient data fetching
- Lazy loading components
- Optimized database queries
- Caching strategies
- Responsive design optimization

## Deployment Notes
- Environment variables for production
- MongoDB Atlas for cloud database
- Vercel/Netlify for frontend
- Heroku/Railway for backend
- SSL certificate required for production

## Troubleshooting
1. **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
2. **Port Conflicts**: Change ports in .env if 8000/5173 are occupied
3. **Dependencies**: Run `npm install` in both frontend and backend directories
4. **CORS Issues**: Ensure frontend URL is allowed in backend CORS settings

## Support
For issues or questions, check the console logs and ensure all dependencies are properly installed.