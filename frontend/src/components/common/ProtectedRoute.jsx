import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute - Loading:", loading);
  console.log("ProtectedRoute - User:", user);
  console.log("ProtectedRoute - Allowed Roles:", allowedRoles);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`User role ${user.role} not in allowed roles`, allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("ProtectedRoute - Access granted");
  return children;
};

export default ProtectedRoute;
