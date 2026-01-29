import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import LearnerDashboard from "./pages/learner/LearnerDashboard";

// Import your existing pages
import ManageUsers from "./pages/admin/ManageUsers";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          {/* Trainer Routes */}
          <Route
            path="/trainer/dashboard"
            element={
              <ProtectedRoute allowedRoles={["trainer", "admin"]}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Learner Routes */}
          <Route
            path="/learner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["learner"]}>
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Unauthorized page */}
          <Route
            path="/unauthorized"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                  <p className="text-xl text-gray-600 mb-4">
                    Unauthorized Access
                  </p>
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Go to Login
                  </a>
                </div>
              </div>
            }
          />

          {/* 404 page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-4">Page Not Found</p>
                  <a
                    href="/login"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Go to Login
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
