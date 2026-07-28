import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

/**
 * Logo
 * -----------------------------------------------------------------------
 * Reusable MOLU logo, wrapped in a link back to the homepage.
 *
 * Usage:
 *   <Logo />                 -> default size, links to "/"
 *   <Logo size="sm" />       -> smaller, e.g. for a tight mobile header
 *   <Logo size="lg" />       -> larger, e.g. for an auth page or footer
 *   <Logo linkTo="/admin" /> -> point it somewhere other than "/"
 *   <Logo asLink={false} />  -> render as a plain <img>, no wrapping <a>
 */

type LogoSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-6 sm:h-7",
  md: "h-7 sm:h-8",
  lg: "h-5 sm:h-5",
};

interface LogoProps {
  size?: LogoSize;
  linkTo?: string;
  asLink?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  linkTo = "/",
  asLink = true,
  className = "",
}: LogoProps) {
  const image = (
    <img
      src={logo}
      alt="MOLU"
      className={`w-auto ${SIZE_CLASSES[size]} ${className}`}
    />
  );

  if (!asLink) return image;

  return (
    <Link to={linkTo} className="flex-shrink-0" aria-label="MOLU home">
      {image}
    </Link>
  );
}