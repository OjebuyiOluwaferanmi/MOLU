import { Button } from "@heroui/react";
import PageContainer from "./PageContainer";
import Logo from "./logo";

/**
 * lucide-react doesn't include brand/logo icons (Instagram, WhatsApp,
 * etc.) — it's a generic icon set, not a brand-icon library. These are
 * small inline SVGs instead, so no extra dependency is needed.
 */
function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.47 14.38c-.29-.15-1.71-.84-1.98-.94-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.13-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.51h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.62.7.22 1.34.19 1.84.12.56-.08 1.71-.7 1.96-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.2-.55-.34z" />
      <path d="M12.02 2.5c-5.24 0-9.5 4.26-9.5 9.5 0 1.68.44 3.29 1.28 4.71L2.5 21.5l4.94-1.27a9.44 9.44 0 0 0 4.58 1.17h.01c5.24 0 9.5-4.26 9.5-9.5s-4.27-9.4-9.51-9.4zm0 17.28h-.01a7.87 7.87 0 0 1-4.01-1.1l-.29-.17-2.99.77.8-2.91-.19-.3a7.76 7.76 0 0 1-1.19-4.15c0-4.3 3.5-7.79 7.8-7.79 2.08 0 4.04.81 5.51 2.28a7.72 7.72 0 0 1 2.28 5.51c0 4.3-3.5 7.86-7.71 7.86z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-white pb-8 mt-4 pt-12">
      <PageContainer>
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          {/* Logo + tagline + CTA */}
          <div className="flex max-w-xs flex-col items-start gap-4">
            <Logo size="md" />
            <p className="text-sm leading-relaxed text-gray-700">
              The best place to shop for your quality and tested products, that&apos;s why
              MICHAEL is the best
            </p>
            <Button className="!rounded-full !bg-brand-blue !px-6 !text-sm !font-medium !text-white hover:!bg-brand-blue/90">
              Shop Now
            </Button>
          </div>

          {/* Contact + Connect columns */}
          <div className="flex flex-wrap gap-12 sm:gap-20">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                Contact
              </h4>
              <p className="text-sm text-gray-700">+ (234) 9132531257</p>
              <p className="text-sm text-gray-700">ojebuyioluwaferanmi9@gmail.com</p>

              <p className="mt-10 text-xs text-gray-400">© {year} — Copyright</p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                Connect With Molu
              </h4>
              <div className="flex gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="MOLU on Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-blue text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://wa.me/2349132531257"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Chat with MOLU on WhatsApp"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-blue text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}