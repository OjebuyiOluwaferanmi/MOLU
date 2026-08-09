import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Dropdown,
  Button,
  Label,
  Avatar,
  CloseButton,
} from "@heroui/react";
import {
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  User,
  CircleHelp,
} from "lucide-react";
import PageContainer from "./PageContainer";
import SearchBar from "./SearchBar";
import Logo from "./logo";
import { Link, useNavigate } from "react-router";
import { useCart } from "../../users/CartPage/CartContext";
import { useAuth } from "../Auth/AuthContext";

const CATEGORIES = [
  { id: "phones-tablets", label: "Phones & Tablets" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "home-office", label: "Home & Office" },
  { id: "health-beauty", label: "Health & Beauty" },
  { id: "groceries", label: "Groceries" },
];

// Scroll amounts below this are ignored entirely — always fully visible
// near the top of the page, no matter which direction you nudge it.
const ALWAYS_VISIBLE_THRESHOLD = 10;
// Minimum scroll delta before flipping hide/show — avoids jitter from
// tiny sub-pixel scroll events rapidly flipping direction.
const DIRECTION_DEADZONE = 5;

export default function Navbar() {
  const { user, isSignedIn, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );

  const [hideTopSection, setHideTopSection] = useState(false);
  const lastScrollY = useRef(0);

  const headerTopRef = useRef<HTMLDivElement>(null);
  const searchRowRef = useRef<HTMLDivElement>(null);
  const [headerTopHeight, setHeaderTopHeight] = useState(0);
  const [searchRowHeight, setSearchRowHeight] = useState(0);

  useLayoutEffect(() => {
    const updateHeights = () => {
      if (headerTopRef.current) setHeaderTopHeight(headerTopRef.current.offsetHeight);
      if (searchRowRef.current) setSearchRowHeight(searchRowRef.current.offsetHeight);
    };
    updateHeights();
    window.addEventListener("resize", updateHeights);
    return () => window.removeEventListener("resize", updateHeights);
  }, [showAnnouncement, mobileMenuOpen, isLargeScreen]);

  // Publish the navbar's total rendered height as a CSS variable so other
  // components (e.g. AccountSidebar) can position themselves correctly
  // below it without prop-drilling — stays accurate even as the
  // announcement bar is dismissed, the mobile search row appears, etc.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--navbar-offset",
      `${headerTopHeight + searchRowHeight}px`
    );
  }, [headerTopHeight, searchRowHeight]);

  useEffect(() => {
    const handleResize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      if (large) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) setHideTopSection(false);
  }, [mobileMenuOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;

        if (currentY < ALWAYS_VISIBLE_THRESHOLD) {
          setHideTopSection(false);
        } else if (currentY > lastScrollY.current + DIRECTION_DEADZONE) {
          setHideTopSection(true);
        } else if (currentY < lastScrollY.current - DIRECTION_DEADZONE) {
          setHideTopSection(false);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <div
  style={{ transform: `translateY(${hideTopSection ? -headerTopHeight : 0}px)` }}
  className="transition-transform duration-300 ease-in-out will-change-transform shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
>
        <div ref={headerTopRef}>
          {showAnnouncement && (
            <div className="w-full bg-brand-blue text-white">
              <div className="relative flex items-center justify-center px-10 py-2 sm:px-12">
                <p className="text-center text-[11px] leading-tight sm:text-sm">
                  Never miss a deal. Sign up for exclusive promos.{" "}
                  <a href="/signup" className="font-semibold underline underline-offset-2">
                    Sign up Now
                  </a>
                </p>
                <div className="absolute right-2 sm:right-4">
                  <CloseButton
                    aria-label="Dismiss announcement"
                    onPress={() => setShowAnnouncement(false)}
                    className="!size-5 !rounded-none !border-none !bg-transparent !p-0 !shadow-none !text-white hover:!bg-transparent hover:!opacity-70 [&_svg]:!text-white [&_svg]:!stroke-white"
                  />
                </div>
              </div>
            </div>
          )}

          <nav className="w-full border-b border-gray-100 bg-white">
            <PageContainer>
              <div className="flex items-center justify-between gap-4 py-2 sm:py-2.5">
                <div className="flex flex-shrink-0 items-center gap-6">
                  <Logo size="lg" />
                <a
                  
                    href="/about"
                    className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-brand-blue lg:block"
                  >
                    About Us
                  </a>

                  <div className="hidden lg:block">
                    <Dropdown>
                      <Button
                        variant="secondary"
                        className="flex items-center gap-1 !bg-transparent !text-sm !font-medium !text-gray-700 !shadow-none hover:!text-brand-blue"
                      >
                        Categories
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Dropdown.Popover className="min-w-[220px] bg-white text-black shadow-lg">
                        <Dropdown.Menu
                          onAction={(key) => console.log(`Category selected: ${key}`)}
                        >
                          {CATEGORIES.map((cat) => (
                            <Dropdown.Item key={cat.id} id={cat.id} textValue={cat.label}>
                              <Label className="text-black">{cat.label}</Label>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  </div>
                </div>

                <div className="hidden flex-1 justify-center lg:flex">
                  <SearchBar className="max-w-md" />
                </div>

                <div className="flex flex-shrink-0 items-center gap-3 sm:gap-5">
                  <div className="hidden lg:block">
                    {isSignedIn && user ? (
                      <AccountDropdown user={user} onLogout={handleLogout} />
                    ) : (
                      <AuthButtons />
                    )}
                  </div>

                  <Link
                    to="/cart"
                    className="relative hidden items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-brand-blue sm:flex"
                  >
                    <span className="relative">
                      <ShoppingCart className="h-5 w-5 text-brand-blue" />
                      {cartCount > 0 && (
                        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      )}
                    </span>
                    <span className="hidden md:inline">Cart</span>
                  </Link>

                  <div className="hidden lg:block">
                    <HelpDropdown />
                  </div>

                  <button
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className="rounded-md p-1 text-gray-700 hover:bg-gray-100 lg:hidden"
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </PageContainer>
          </nav>
        </div>

        <div ref={searchRowRef} className="border-t border-gray-100 bg-white py-2 lg:hidden">
          <PageContainer>
            <SearchBar inputName="mobile-search" />
          </PageContainer>
        </div>
      </div>

      {/* Order: About Us -> Categories -> Help -> (My Account/Settings    */}
      {/* if signed in) -> Cart -> Login/Sign Up OR Log Out (always last)  */}
      {mobileMenuOpen && (
        <div
          style={{ top: headerTopHeight }}
          className="fixed inset-x-0 bottom-0 overflow-y-auto overscroll-contain border-t border-gray-100 bg-white shadow-md lg:hidden"
        >
          <PageContainer className="flex flex-col gap-1 py-4">
            <a href="/about" className="rounded-md px-2 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              About Us
            </a>

            <MobileSection title="Categories">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  {cat.label}
                </a>
              ))}
            </MobileSection>

            <MobileSection title="Help">
              <a href="/faq" className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50">
                FAQ
              </a>
              <a
                href="https://wa.me/234XXXXXXXXXX"
                target="_blank"
                rel="noreferrer"
                className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Chat on WhatsApp
              </a>
            </MobileSection>

            {isSignedIn && (
              <>
                <MobileSection title="My Account">
                  {/* Orders wired to the real page; the rest are
                      placeholders until those pages exist. */}
                  <Link
                    to="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Orders
                  </Link>
                  {["Wishlist", "Browsing History", "Coupons & Offers", "Inbox", "Rating & Reviews", "Credit Balance"].map(
                    (item) => (
                      <a key={item} href="#" className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        {item}
                      </a>
                    )
                  )}
                </MobileSection>

                <MobileSection title="My Settings">
                  {["Address Book", "Account Management", "Notifications"].map((item) => (
                    <a key={item} href="#" className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-50">
                      {item}
                    </a>
                  ))}
                </MobileSection>
              </>
            )}

            <Link
              to="/cart"
              className="mt-2 flex items-center justify-between rounded-md border-t border-gray-100 px-2 pb-2.5 pt-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {isSignedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="block rounded-md px-2 py-2.5 text-left text-sm font-medium text-brand-red hover:bg-red-50"
              >
                Log Out
              </button>
            ) : (
              <div className="flex flex-col gap-2 px-2 pt-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="!w-full !bg-brand-blue !text-white">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="!w-full !border !border-brand-blue !bg-white !text-brand-blue">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </PageContainer>
        </div>
      )}
    </header>

    <div style={{ height: headerTopHeight + searchRowHeight }} />
    </>
  );
}

function AccountDropdown({
  user,
  onLogout,
}: {
  user: { firstName: string; lastName: string; email: string };
  onLogout: () => void;
}) {
  return (
    <Dropdown>
      <Dropdown.Trigger className="flex items-center gap-1.5 rounded-md px-1 text-sm font-medium text-gray-700 transition-colors hover:text-brand-blue">
        <User className="h-4 w-4 text-brand-blue" />
        <span>Hello, {user.firstName}</span>
        <ChevronDown className="h-4 w-4" />
      </Dropdown.Trigger>

      <Dropdown.Popover className="min-w-[240px] bg-white text-black shadow-lg">
        <div className="flex items-center gap-2 border-b border-gray-100 px-3 pb-3 pt-3">
          <Avatar size="sm">
            <Avatar.Image alt={`${user.firstName} ${user.lastName}`} src="/avatar-placeholder.png" />
            <Avatar.Fallback delayMs={600}>
              {user.firstName[0]}
              {user.lastName[0]}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <p className="text-sm font-medium leading-5 text-black">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-gray-500">{user.email}</p>
          </div>
        </div>

        <Dropdown.Menu>
          <Dropdown.SubmenuTrigger>
            <Dropdown.Item id="my-account" textValue="My Account">
              <Label className="text-black">My Account</Label>
              <Dropdown.SubmenuIndicator />
            </Dropdown.Item>
            <Dropdown.Popover className="bg-white text-black shadow-lg">
              <Dropdown.Menu>
                {/* Orders wired to the real page; the rest are placeholders
                    until those pages exist — wire them the same way once
                    each one is built. */}
                <Dropdown.Item id="orders" textValue="Orders">
                  <Link to="/account/orders" className="block w-full">
                    <Label className="text-black">Orders</Label>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item id="wishlist" textValue="Wishlist">
                  <Label className="text-black">Wishlist</Label>
                </Dropdown.Item>
                <Dropdown.Item id="browsing-history" textValue="Browsing History">
                  <Label className="text-black">Browsing History</Label>
                </Dropdown.Item>
                <Dropdown.Item id="coupons" textValue="Coupons & Offers">
                  <Label className="text-black">Coupons & Offers</Label>
                </Dropdown.Item>
                <Dropdown.Item id="inbox" textValue="Inbox">
                  <Label className="text-black">Inbox</Label>
                </Dropdown.Item>
                <Dropdown.Item id="reviews" textValue="Rating & Reviews">
                  <Label className="text-black">Rating & Reviews</Label>
                </Dropdown.Item>
                <Dropdown.Item id="credit-balance" textValue="Credit Balance">
                  <Label className="text-black">Credit Balance</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>

          <Dropdown.SubmenuTrigger>
            <Dropdown.Item id="my-settings" textValue="My Settings">
              <Label className="text-black">My Settings</Label>
              <Dropdown.SubmenuIndicator />
            </Dropdown.Item>
            <Dropdown.Popover className="bg-white text-black shadow-lg">
              <Dropdown.Menu>
                <Dropdown.Item id="address-book" textValue="Address Book">
                  <Label className="text-black">Address Book</Label>
                </Dropdown.Item>
                <Dropdown.Item id="account-management" textValue="Account Management">
                  <Label className="text-black">Account Management</Label>
                </Dropdown.Item>
                <Dropdown.Item id="notifications" textValue="Notifications">
                  <Label className="text-black">Notifications</Label>
                </Dropdown.Item>
                <Dropdown.Item id="logout" textValue="Log Out" variant="danger" onAction={onLogout}>
                  <Label className="text-brand-red">Log Out</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.SubmenuTrigger>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button
          variant="secondary"
          className="!border !border-gray-200 !bg-white !text-sm !font-medium !text-gray-700 hover:!border-brand-blue hover:!text-brand-blue"
        >
          Login
        </Button>
      </Link>
      <Link to="/signup">
        <Button className="!bg-brand-blue !text-sm !font-medium !text-white hover:!bg-brand-blue/90">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}

function HelpDropdown() {
  return (
    <Dropdown>
      <Button
        variant="secondary"
        className="flex items-center gap-1 !bg-transparent !text-sm !font-medium !text-gray-700 !shadow-none hover:!text-brand-blue"
      >
        <CircleHelp className="h-4 w-4 text-brand-blue" />
        Help
        <ChevronDown className="h-4 w-4" />
      </Button>
      <Dropdown.Popover className="min-w-[180px] bg-white text-black shadow-lg">
        <Dropdown.Menu>
          <Dropdown.Item id="faq" textValue="FAQ">
            <a href="/faq" className="block w-full">
              <Label className="text-black">FAQ</Label>
            </a>
          </Dropdown.Item>
          <Dropdown.Item id="whatsapp" textValue="Chat on WhatsApp">
           <a 
              href="https://wa.me/234XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="block w-full"
            >
              <Label className="text-black">Chat on WhatsApp</Label>
            </a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 border-t border-gray-100 pt-2">
      <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}