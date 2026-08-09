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
  X,
  type LucideIcon,
} from "lucide-react";

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

/** Full labeled sidebar content — reused by both the static desktop
 * sidebar and the mobile expanded overlay, so nothing is duplicated.
 * `onClose` is only passed by the mobile overlay — when present, the
 * close (X) button renders inline next to "My Account". */
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

export function AccountSidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Matches the item's own path AND anything nested under it — e.g.
  // "/account/orders" stays active while viewing "/account/orders/MLU-123".
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const allItems = [...ACCOUNT_ITEMS, ...SETTINGS_ITEMS];

  // Lock page scroll while the mobile overlay is open — only the sidebar
  // itself should scroll, not the page behind it.
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
    <>
      {/* ---------------- Desktop: always-expanded static sidebar ---------------- */}
      <aside className="sticky top-[var(--navbar-offset)] hidden w-64 shrink-0 flex-col rounded-3xl bg-white p-4 shadow-sm lg:flex">
        <SidebarContent isActive={isActive} />
      </aside>

      {/* ---------------- Below lg: icon rail + expandable overlay ---------------- */}
      <div className="self-stretch lg:hidden">
        <aside className="sticky top-[var(--navbar-offset)] flex w-16 shrink-0 flex-col items-center gap-1 rounded-3xl bg-white p-2 shadow-sm">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand account menu"
            className="mb-1 flex cursor-pointer items-center justify-center rounded-full p-2.5 text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          {allItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label={item.label}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
                  isActive(item.path) ? "bg-brand-blue text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </aside>

        {isExpanded && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/30"
              onClick={() => setIsExpanded(false)}
              aria-hidden="true"
            />
            {/* Flush against the left edge (no left margin), spans from
                right below the navbar down to the bottom of the viewport,
                and scrolls internally — same drawer pattern as the
                Navbar's own mobile menu, so scrolling here no longer
                bleeds through to the page behind it. */}
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
    </>
  );
}