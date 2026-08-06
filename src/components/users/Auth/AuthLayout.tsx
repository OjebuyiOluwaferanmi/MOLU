import type { ReactNode } from "react";
import { Link } from "react-router";
import Logo from "../common/logo";
import moluWhite from "../../../assets/molu-white.png";


interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#F1F1F1]">
      {/* Brand panel — desktop only */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#3654D6] p-12 lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10" />

        <Link to="/" className="relative z-10 cursor-pointer" aria-label="MOLU home">
  <img src={moluWhite} alt="MOLU" className="h-8 w-auto" />
</Link>

        <div className="relative z-10 flex flex-col gap-4 text-white">
          <h2 className="text-3xl font-bold leading-tight">
            Everything you need, <br /> just a click away.
          </h2>
          <p className="max-w-sm text-sm text-white/80">
            Join thousands shopping the best deals on electronics, fashion,
            groceries, and more — all in one place.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/60">
          &copy; {new Date().getFullYear()} Molu. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6 lg:w-1/2">        {/* Mobile-only logo, since the brand panel is hidden below lg */}
        <div className="mb-8 lg:hidden">
  <Logo size="lg" />
</div>

        <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-sm sm:p-6">          <div className="mb-4 text-left">            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}