import type { ReactNode } from "react";

/**
 * PageContainer
 * -----------------------------------------------------------------------
 * The single source of truth for MOLU's left/right page margin.
 *
 * The navbar and footer stay full-width (bg spans edge to edge), but the
 * CONTENT inside them is wrapped in this component so it lines up with
 * every other section on the site (headings, product grids, etc).
 *
 * Usage:
 *   <PageContainer>
 *     <YourSectionContent />
 *   </PageContainer>
 *
 * Adjust MAX_WIDTH / PADDING below once — every page that uses this
 * component updates automatically. Don't hardcode "px-4 sm:px-6 lg:px-10"
 * anywhere else in the app; always wrap with this instead.
 */

const MAX_WIDTH = ""; // tweak to taste against your Figma
const PADDING = "px-4 sm:px-6 lg:px-10 xl:px-55";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`mx-auto w-full ${MAX_WIDTH} ${PADDING} ${className}`}>
      {children}
    </div>
  );
}