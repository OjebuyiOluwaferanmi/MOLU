import { GoogleIcon, FacebookIcon } from "./icons";

interface SocialAuthButtonsProps {
  /** Copy changes slightly between login/signup, e.g. "Sign in" vs "Sign up" */
  actionLabel: string;
}

// TODO: wire up to real OAuth flows once the backend exists — these are
// presentational only for now.
export function SocialAuthButtons({ actionLabel }: SocialAuthButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        <GoogleIcon />
        {actionLabel} with Google
      </button>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
      >
        <FacebookIcon />
        {actionLabel} with Facebook
      </button>
    </div>
  );
}