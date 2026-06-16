import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate BreadcrumbList JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rahulbaberwal.com"
      },
      ...items.map((item, idx) => {
        let url = 'https://rahulbaberwal.com';
        if (item.href) {
          url = item.href.startsWith('http') ? item.href : `https://rahulbaberwal.com${item.href}`;
        }
        return {
          "@type": "ListItem",
          "position": idx + 2,
          "name": item.label,
          ...(item.href ? { "item": url } : {})
        };
      })
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumbs-nav font-mono text-xs select-none">
        <ol className="flex items-center flex-wrap gap-2 text-[var(--text2)]">
          <li>
            <Link href="/" className="hover:text-[var(--accent)] transition-colors duration-200 flex items-center gap-1">
              <i className="fa-solid fa-house text-[10px]"></i>
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <React.Fragment key={idx}>
                <li className="text-[var(--text3)]" aria-hidden="true">
                  <i className="fa-solid fa-chevron-right text-[8px] mx-1"></i>
                </li>
                <li>
                  {item.href && !isLast ? (
                    <Link href={item.href} className="hover:text-[var(--accent)] transition-colors duration-200">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[var(--text)] font-semibold truncate max-w-[200px] sm:max-w-xs md:max-w-md inline-block align-bottom">
                      {item.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
