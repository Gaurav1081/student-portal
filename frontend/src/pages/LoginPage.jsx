import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/CCALogo.png";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');
`;

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

        setTimeout(() => {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <style>{fontStyle}</style>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border-2 border-[#e8e8e8]">
        <div>
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Student Portal Logo"
              className="h-15 w-auto"
            />
          </div>
          <h2
            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}
            className="text-center text-4xl text-[#0a0a0a]"
          >
            Student Portal
          </h2>
          <p
            style={{ fontFamily: 'Poppins, sans-serif' }}
            className="mt-2 text-center text-sm text-[#555555]"
          >
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                className="block text-sm font-medium text-[#0a0a0a] mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                style={{ fontFamily: 'Poppins, sans-serif' }}
                className="appearance-none relative block w-full px-3 py-3 border-2 border-[#e8e8e8] placeholder-[#555555] text-[#0a0a0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8001C] focus:border-[#E8001C] bg-white transition-colors"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                className="block text-sm font-medium text-[#0a0a0a] mb-1"
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
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border-2 border-[#e8e8e8] placeholder-[#555555] text-[#0a0a0a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8001C] focus:border-[#E8001C] bg-white transition-colors"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555555] hover:text-[#0a0a0a] transition-colors"
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
            <div className="rounded-lg bg-[#E8001C] p-4">
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
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-medium text-white">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{ fontFamily: 'Poppins, sans-serif' }}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-[#0a0a0a] text-sm font-semibold rounded-lg text-white bg-[#0a0a0a] hover:bg-[#E8001C] hover:border-[#E8001C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E8001C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;