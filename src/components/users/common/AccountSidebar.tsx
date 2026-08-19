import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Package,
  Heart,
  History,
  BadgePercent,
  Inbox as InboxIcon,
  Star,
  Wallet,
  MapPin,
  UserCog,
  Bell,
  LogOut,
  Menu,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";
import PageContainer from "../common/PageContainer";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const ACCOUNT_ITEMS: NavItem[] = [
  { label: "My Orders", path: "/account/orders", icon: Package },
  { label: "Wishlist", path: "/account/wishlist", icon: Heart },
  { label: "Browsing History", path: "/account/browsing-history", icon: History },
  { label: "Coupons & Offers", path: "/account/coupons", icon: BadgePercent },
  { label: "Inbox", path: "/account/inbox", icon: InboxIcon },
  { label: "Rating & Reviews", path: "/account/reviews", icon: Star },
  { label: "Credit Balance", path: "/account/credit-balance", icon: Wallet },
];

const SETTINGS_ITEMS: NavItem[] = [
  { label: "Address Book", path: "/account/address-book", icon: MapPin },
  { label: "Account Management", path: "/account/settings", icon: UserCog },
  { label: "Notifications", path: "/account/notifications", icon: Bell },
];

/** Shared active-path matching — used by both the desktop sidebar and the
 * mobile menu, so they never disagree about what's "active". */
function useIsAccountPathActive() {
  const location = useLocation();
  return (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);
}

function NavRow({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={`flex cursor-pointer items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive ? "bg-brand-blue text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

/** Full labeled nav content — reused by both the static desktop sidebar
 * and the mobile expanded overlay, so nothing is duplicated. `onClose` is
 * only passed by the mobile overlay — when present, a close (X) button
 * renders inline next to "My Account". */
function SidebarContent({
  isActive,
  onNavigate,
  onClose,
}: {
  isActive: (path: string) => boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-3">
        <h2 className="text-base font-bold text-gray-900">My Account</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Collapse account menu"
            className="flex cursor-pointer items-center justify-center rounded-full p-1 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="mt-2 flex flex-col gap-1.5">
        {ACCOUNT_ITEMS.map((item) => (
          <NavRow key={item.path} item={item} isActive={isActive(item.path)} onNavigate={onNavigate} />
        ))}
      </nav>

      <h2 className="mt-6 border-t border-gray-100 px-3 pt-6 text-base font-bold text-gray-900">
        My Settings
      </h2>
      <nav className="mt-2 flex flex-col gap-1.5">
        {SETTINGS_ITEMS.map((item) => (
          <NavRow key={item.path} item={item} isActive={isActive(item.path)} onNavigate={onNavigate} />
        ))}
        <button
          type="button"
          className="mt-1 flex cursor-pointer items-center gap-3 rounded-full px-3 py-2.5 text-left text-sm font-medium text-brand-red hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </nav>
    </>
  );
}

/**
 * Desktop-only static sidebar. Renders inside PageContainer alongside the
 * page content, as part of the normal lg:flex-row layout — unchanged from
 * before, this file only reorganizes the mobile side of things.
 */
export function AccountSidebar() {
  const isActive = useIsAccountPathActive();

  return (
    <aside className="sticky top-[var(--navbar-offset)] hidden w-64 shrink-0 flex-col rounded-3xl bg-white p-4 shadow-sm transition-[top] duration-300 ease-in-out lg:flex">
      <SidebarContent isActive={isActive} />
    </aside>
  );
}

/**
 * Mobile/tablet menu trigger.
 * -----------------------------------------------------------------------
 * Rendered as a SIBLING of PageContainer in AccountLayout — NOT nested
 * inside it — so its background can span the true full viewport width,
 * the same way Navbar/Footer achieve edge-to-edge backgrounds. Only the
 * button *inside* it is wrapped in PageContainer, purely to align with
 * the rest of the page's left/right margins.
 *
 * Its vertical padding (py-3 below) lives on the bar itself rather than
 * being borrowed from page-level spacing, so it stays visually consistent
 * whether the navbar above is fully shown or hidden-down-to-search-only.
 *
 * Background is bg-[#F1F1F1] to exactly match the page body — Tailwind's
 * bg-gray-100 is a close but not identical hex, and that mismatch was
 * almost certainly what looked like a stray shadow/seam before.
 */
export function MobileAccountMenu() {
  const isActive = useIsAccountPathActive();
  const [isExpanded, setIsExpanded] = useState(false);

  // Lock page scroll while the overlay is open — only the drawer itself
  // should scroll, not the page behind it.
  useEffect(() => {
    if (isExpanded) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isExpanded]);

  return (
    <div className="sticky top-[var(--navbar-offset)] z-20 w-full bg-[#F1F1F1] py-3 transition-[top] duration-300 ease-in-out lg:hidden">
      <PageContainer>
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          aria-label="Open account menu"
          className="flex w-full cursor-pointer items-center justify-between rounded-3xl bg-white p-4 shadow-sm"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Menu className="h-4 w-4 text-brand-blue" />
            My Account
          </span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </button>
      </PageContainer>

      {isExpanded && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30"
            onClick={() => setIsExpanded(false)}
            aria-hidden="true"
          />
          {/* Same drawer pattern as Navbar's own mobile menu — flush left,
              spans navbar-bottom to viewport-bottom, scrolls internally. */}
          <div className="fixed left-0 top-[var(--navbar-offset)] bottom-0 z-40 w-72 max-w-[85%] overflow-y-auto overscroll-contain bg-white p-4 shadow-lg">
            <SidebarContent
              isActive={isActive}
              onNavigate={() => setIsExpanded(false)}
              onClose={() => setIsExpanded(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}