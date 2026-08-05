import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthLayout } from "../../components/users/Auth/AuthLayout";

export default function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  // TODO: wire up to a real "send reset link" endpoint once the backend
  // exists — this just flips to the confirmation state for now.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    setSubmittedEmail(email);
  };

  if (submittedEmail) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a password reset link">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-6 w-6 text-[#3654D6]" />
          </span>
          <p className="text-sm text-gray-600">
            We sent a password reset link to{" "}
            <span className="font-semibold text-gray-900">{submittedEmail}</span>. Click the
            link in that email to set a new password.
          </p>
          <p className="text-xs text-gray-400">
            Didn't get it? Check your spam folder, or{" "}
            <button
              type="button"
              onClick={() => setSubmittedEmail(null)}
              className="cursor-pointer font-medium text-[#3654D6] hover:underline"
            >
              try a different email
            </button>
            .
          </p>
        </div>

        <Link
          to="/login"
          className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
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

        <button
          type="submit"
          className="mt-1 w-full cursor-pointer rounded-full bg-[#3654D6] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#2d47bd]"
        >
          Send Reset Link
        </button>
      </form>

      <Link
        to="/login"
        className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#3654D6]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>
    </AuthLayout>
  );
}