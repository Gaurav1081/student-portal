import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/CCA_black.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== LOGIN ATTEMPT STARTED ===");
    console.log("Form data:", formData);

    setLoading(true);
    setError("");

    try {
      console.log("Calling login function...");
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);

      if (result.success) {
        console.log("Login successful!");
        console.log("User role:", result.user.role);

        // Small delay to ensure state updates
        setTimeout(() => {
          // Redirect based on role
          switch (result.user.role) {
            case "admin":
              console.log("Navigating to admin dashboard...");
              navigate("/admin/dashboard", { replace: true });
              break;
            case "trainer":
              console.log("Navigating to trainer dashboard...");
              navigate("/trainer/dashboard", { replace: true });
              break;
            case "learner":
              console.log("Navigating to learner dashboard...");
              navigate("/learner/dashboard", { replace: true });
              break;
            default:
              console.log("Unknown role, navigating to home...");
              navigate("/", { replace: true });
          }
        }, 100);
      } else {
        console.log("Login failed:", result.error);
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Exception during login:", err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @font-face {
          font-family: 'Barlow Condensed';
          src: url('/fonts/BarlowCondensed-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        
        .barlow {
          font-family: 'Barlow Condensed', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .impact {
          font-family: Impact, 'Arial Black', sans-serif;
        }
        
        .monaco {
          font-family: Monaco, 'Courier New', monospace;
        }
      `}</style>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div>
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="Student Portal Logo" 
              className="h-20 w-auto"
            />
          </div>
          <h2 className="barlow text-center text-4xl font-extrabold text-black">
            Student Portal
          </h2>
          <p className="barlow mt-2 text-center text-sm text-black">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="barlow block text-sm font-medium text-black mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="barlow appearance-none relative block w-full px-3 py-3 border-2 border-black placeholder-gray-500 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="barlow block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="barlow appearance-none relative block w-full px-3 py-3 pr-10 border-2 border-black placeholder-gray-500 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-black hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-black p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="barlow text-sm font-medium text-white">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="barlow group relative w-full flex justify-center py-3 px-4 border-2 border-black text-sm font-medium rounded-lg text-white bg-black hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="barlow text-sm text-black">Demo Credentials:</p>
            <div className="monaco mt-2 text-xs text-black space-y-1">
              <p>Admin: admin@test.com / 123456</p>
              <p>Trainer: trainer@test.com / 123456</p>
              <p>Student: student@test.com / 123456</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;