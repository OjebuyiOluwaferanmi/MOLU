import { Breadcrumbs } from "@heroui/react";

export interface BreadcrumbItem {
  label: string;
  // Omit href on the current/last item — it renders as plain bold text,
  // not a link.
  href?: string;
}

interface ProductBreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Renders the "Home / Category / Subcategory / Current Item" trail shown
 * at the top of category and product pages.
 *
 * Build `items` from the product/category's own hierarchy — e.g. for a
 * product page:
 *
 *   <ProductBreadcrumbs
 *     items={[
 *       { label: "Home", href: "/" },
 *       { label: "Phones", href: "/category/phones-tablets" },
 *       { label: "iOS Phones", href: "/category/phones-tablets/ios" },
 *       { label: "iPhone 17 Pro Max - 12GB - 1TB - Silver" }, // current page, no href
 *     ]}
 *   />
 */
export function ProductBreadcrumbs({ items }: ProductBreadcrumbsProps) {
  return (
    <div className="w-full rounded-full mt-4 bg-white px-6 py-4 shadow-sm">
      <Breadcrumbs className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Breadcrumbs.Item
              key={`${item.label}-${index}`}
              href={isLast ? undefined : item.href}
              className={
                isLast
                  ? "font-semibold text-gray-900"
                  : "text-gray-500 transition-colors hover:text-[#3654D6]"
              }
            >
              {item.label}
            </Breadcrumbs.Item>
          );
        })}
      </Breadcrumbs>
    </div>
  );
}