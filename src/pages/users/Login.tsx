import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "../../components/users/Auth/AuthLayout";
import { SocialAuthButtons } from "../../components/users/Auth/SocialAuthButtons";
import { AuthDivider } from "../../components/users/Auth/AuthDivider";
import { useAuth } from "../../components/users/Auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set by RequireAuth (or anywhere else that redirects here) — where the
  // user was actually trying to go before they got sent to log in.
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to your account">
      <SocialAuthButtons actionLabel="Continue" />

      <div className="my-6">
        <AuthDivider />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        {redirectTo !== "/" && !error && (
          <p className="rounded-xl bg-blue-50 px-3.5 py-2.5 text-sm text-brand-blue">
            Log in to continue where you left off.
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-brand-red">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/forgot-password" className="cursor-pointer text-xs font-medium text-[#3654D6] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              className="w-full rounded-full border border-gray-200 px-4 py-3 pr-11 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full cursor-pointer rounded-full bg-[#3654D6] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#2d47bd]"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="cursor-pointer font-semibold text-[#3654D6] hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}