import { useState } from "react";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "../../components/users/Auth/AuthLayout";
import { SocialAuthButtons } from "../../components/users/Auth/SocialAuthButtons";
import { AuthDivider } from "../../components/users/Auth/AuthDivider";

// Trimmed placeholder list — swap for a full ISO country list (or a
// dedicated package) once this is wired up for real.
const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
];

const inputClass =
  "rounded-full border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: wire up to real auth once the backend exists — UI only for now.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout title="Create your account" subtitle="Sign up to start shopping on Molu">
      <SocialAuthButtons actionLabel="Sign up" />

      <div className="my-6">
        <AuthDivider />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        {/* Name row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input id="firstName" type="text" required placeholder="John" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="middleName" className="text-sm font-medium text-gray-700">
              Middle Name <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input id="middleName" type="text" placeholder="Kolawole" className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input id="lastName" type="text" required placeholder="Doe" className={inputClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a password"
              className={`w-full pr-11 ${inputClass}`}
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

        {/* Phone + Country */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+234 800 000 0000"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              required
              defaultValue=""
              className={`cursor-pointer appearance-none bg-white ${inputClass}`}
            >
              <option value="" disabled>
                Select country
              </option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="dob" className="text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              required
              className={`cursor-pointer ${inputClass}`}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="gender" className="text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              required
              defaultValue=""
              className={`cursor-pointer appearance-none bg-white ${inputClass}`}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-xs text-gray-500">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-[#3654D6] focus:ring-[#3654D6]"
          />
          I agree to Molu's{" "}
          <Link to="/terms" className="cursor-pointer font-medium text-[#3654D6] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="cursor-pointer font-medium text-[#3654D6] hover:underline">
            Privacy Policy
          </Link>
        </label>

        <button
          type="submit"
          className="mt-1 w-full cursor-pointer rounded-full bg-[#3654D6] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#2d47bd]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="cursor-pointer font-semibold text-[#3654D6] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}