import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeroSection from "./components/Home/HomePage";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import LoginForm from "./components/Users/Login";
import { useSelector } from "react-redux";
import RegistrationForm from "./components/Users/Register";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import CategoryPage from "./components/Category/CategoryPage";
import UpdateCategory from "./components/Category/UpdateCategory";
import TransactionForm from "./components/Transactions/TransactionForm";
import Dashboard from "./components/Users/Dashboard";
import UserProfile from "./components/Users/UserProfile";
import AuthRoute from "./components/Auth/AuthRoute";
import RecurringExpenseList from "./components/RecurringExpenses/RecurringExpenseList";
import ExpenseAnalytics from "./components/Analytics/ExpenseAnalytics";
import BudgetDashboard from "./components/Budget/BudgetDashboard";
import GoalsDashboard from "./components/Goals/GoalsDashboard";
import ReportsDashboard from "./components/Reports/ReportsDashboard";
// import FinancialForecast from "./components/Goals/FinancialForecast";
import NotificationCenter from "./components/Notifications/NotificationCenter";

function App() {
  const user = useSelector((state) => state?.auth?.user);

  return (
    <BrowserRouter>
      {/* Navbar */}

      {user ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/categories"
          element={
            <AuthRoute>
              <CategoryPage />
            </AuthRoute>
          }
        />
        <Route
          path="/update-category/:id"
          element={
            <AuthRoute>
              <UpdateCategory />
            </AuthRoute>
          }
        />
        <Route
          path="/add-transaction"
          element={
            <AuthRoute>
              <TransactionForm />
            </AuthRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <UserProfile />
            </AuthRoute>
          }
        />

        <Route
          path="/recurring-expenses"
          element={
            <AuthRoute>
              <RecurringExpenseList />
            </AuthRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <AuthRoute>
              <BudgetDashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <AuthRoute>
              <GoalsDashboard />
            </AuthRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <AuthRoute>
              <ReportsDashboard />
            </AuthRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <AuthRoute>
              <NotificationCenter />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
