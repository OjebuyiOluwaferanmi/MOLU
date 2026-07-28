import { useEffect, useState } from "react";
import {
  Dropdown,
  Button,
  Label,
  Avatar,
  SearchField,
  CloseButton,
  Switch,
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
import Logo from "./logo";

/**
 * NOTE ON COLORS
 * -----------------------------------------------------------------------
 * These come from the @theme block in src/index.css:
 *
 *   @theme {
 *     --color-brand-blue: #384CE5;
 *     --color-brand-red: #E5383B;
 *     --font-sans: "Poppins", sans-serif;
 *   }
 *
 * That's what makes bg-brand-blue, text-brand-red, etc. work everywhere.
 */

// ---------------------------------------------------------------------------
// TEMP DEV TOGGLE — remove once real auth/session state exists.
// Renders as a small switch inline in the navbar (no label, icon-only)
// so you can preview signed-in vs signed-out states without a backend,
// without it floating over/blocking content on small screens.
// ---------------------------------------------------------------------------
const SHOW_DEV_TOGGLE = true;

const CATEGORIES = [
  { id: "phones-tablets", label: "Phones & Tablets" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "home-office", label: "Home & Office" },
  { id: "health-beauty", label: "Health & Beauty" },
  { id: "groceries", label: "Groceries" },
];

export default function Navbar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 pb-4 w-full">
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

      <nav className="w-full border-b border-gray-100 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
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

            <div className="hidden flex-1 justify-center md:flex">
              <SearchField name="search" aria-label="Search MOLU" className="w-full max-w-md">
                <SearchField.Group className="rounded-full border border-gray-200 bg-gray-50 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue">
                  <SearchField.SearchIcon className="ml-3 text-gray-400" />
                  <SearchField.Input
                    placeholder="Search Molu"
                    className="bg-transparent py-2 text-sm placeholder:text-gray-400"
                  />
                  <SearchField.ClearButton className="mr-2" />
                </SearchField.Group>
              </SearchField>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3 sm:gap-5">
              {/* TEMP DEV TOGGLE — icon-only, no label, inline in the row */}
              {SHOW_DEV_TOGGLE && (
                <Switch
                  isSelected={isSignedIn}
                  onChange={setIsSignedIn}
                  aria-label="Toggle signed in state (dev only)"
                >
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch.Content>
                </Switch>
              )}

              <div className="hidden lg:block">
                {isSignedIn ? <AccountDropdown /> : <AuthButtons />}
              </div>

              <a
                href="/cart"
                className="hidden items-center gap-1.5 text-sm font-medium text-gray-700 transition-colors hover:text-brand-blue sm:flex"
              >
                <ShoppingCart className="h-5 w-5 text-brand-blue" />
                <span className="hidden md:inline">Cart</span>
              </a>

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

        <div className="border-t border-gray-100 py-2 md:hidden">
          <PageContainer>
            <SearchField name="mobile-search" aria-label="Search MOLU">
              <SearchField.Group className="rounded-full border border-gray-200 bg-gray-50">
                <SearchField.SearchIcon className="ml-3 text-gray-400" />
                <SearchField.Input
                  placeholder="Search Molu"
                  className="bg-transparent py-2 text-sm placeholder:text-gray-400"
                />
                <SearchField.ClearButton className="mr-2" />
              </SearchField.Group>
            </SearchField>
          </PageContainer>
        </div>
      </nav>

      {/* Mobile menu drawer                                               */}
      {/* Order: About Us -> Categories -> Help -> (My Account/Settings    */}
      {/* if signed in) -> Cart -> Login/Sign Up OR Log Out (always last)  */}
      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gray-100 bg-white shadow-md lg:hidden">
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
                  {["Orders", "Wishlist", "Browsing History", "Coupons & Offers", "Inbox", "Rating & Reviews", "Credit Balance"].map(
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

            <a
              href="/cart"
              className="mt-2 flex items-center gap-2 rounded-md border-t border-gray-100 px-2 pb-2.5 pt-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
            </a>

            {isSignedIn ? (
              <a href="#" className="block rounded-md px-2 py-2.5 text-sm font-medium text-brand-red hover:bg-red-50">
                Log Out
              </a>
            ) : (
              <div className="flex flex-col gap-2 px-2 pt-1">
                <Button className="!w-full !bg-brand-blue !text-white">Login</Button>
                <Button variant="secondary" className="!w-full !border !border-brand-blue !bg-white !text-brand-blue">
                  Sign Up
                </Button>
              </div>
            )}
          </PageContainer>
        </div>
      )}
    </header>
  );
}

function AccountDropdown() {
  return (
    <Dropdown>
      <Dropdown.Trigger className="flex items-center gap-1.5 rounded-md px-1 text-sm font-medium text-gray-700 transition-colors hover:text-brand-blue">
        <User className="h-4 w-4 text-brand-blue" />
        <span>Hello, Oluwaferanmi</span>
        <ChevronDown className="h-4 w-4" />
      </Dropdown.Trigger>

      <Dropdown.Popover className="min-w-[240px] bg-white text-black shadow-lg">
        <div className="flex items-center gap-2 border-b border-gray-100 px-3 pb-3 pt-3">
          <Avatar size="sm">
            <Avatar.Image alt="Oluwaferanmi" src="/avatar-placeholder.png" />
            <Avatar.Fallback delayMs={600}>OA</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <p className="text-sm font-medium leading-5 text-black">Oluwaferanmi Ojebuyi</p>
            <p className="text-xs leading-none text-gray-500">ojebuyioluwaferanmi9@email.com</p>
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
                <Dropdown.Item id="orders" textValue="Orders">
                  <Label className="text-black">Orders</Label>
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
                <Dropdown.Item id="logout" textValue="Log Out" variant="danger">
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
      <Button
        variant="secondary"
        className="!border !border-gray-200 !bg-white !text-sm !font-medium !text-gray-700 hover:!border-brand-blue hover:!text-brand-blue"
      >
        Login
      </Button>
      <Button className="!bg-brand-blue !text-sm !font-medium !text-white hover:!bg-brand-blue/90">
        Sign Up
      </Button>
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