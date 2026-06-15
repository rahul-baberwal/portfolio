'use client';

import React from 'react';
import { Package } from '../lib/types';

interface PackagesSectionProps {
  packages: Package[];
}

export default function PackagesSection({ packages }: PackagesSectionProps) {
  if (!packages || packages.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": packages.map((pkg, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": pkg.title,
        "description": pkg.description,
        "codeRepository": pkg.github_url,
        "url": pkg.docs_url || pkg.github_url || `https://rahulbaberwal.com/#package-${pkg.slug}`,
        "author": {
          "@id": "https://rahulbaberwal.com/#person"
        }
      }
    }))
  };

  return (
    <section id="packages">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="section-label">Open Source</div>
          <h2 className="section-title">Packages & Tools</h2>
          <p className="text-lg text-[var(--text2)] max-w-2xl leading-relaxed">
            Tools, libraries, and integrations I've built for the developer community. Available on PyPI and GitHub.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group relative flex flex-col justify-between bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--accent)] transition-all duration-300 overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Header: Logo and Links */}
                <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-xl bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center p-2 shadow-inner">
                    {pkg.logo_url ? (
                      <img 
                        src={pkg.logo_url.startsWith('http') || pkg.logo_url.startsWith('/') ? pkg.logo_url : `/packages/${pkg.logo_url}`} 
                        alt={pkg.title} 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <i className="fa-solid fa-box text-2xl text-[var(--text2)]"></i>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {pkg.github_url && (
                      <a
                        href={pkg.github_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${pkg.title} on GitHub`}
                        className="h-10 w-10 rounded-full bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors"
                      >
                        <i className="fa-brands fa-github" aria-hidden="true"></i>
                      </a>
                    )}
                    {pkg.docs_url && (
                      <a
                        href={pkg.docs_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${pkg.title} documentation`}
                        className="h-10 w-10 rounded-full bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] hover:border-[var(--accent2)] transition-colors"
                      >
                        <i className="fa-solid fa-book" aria-hidden="true"></i>
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold font-mono mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {pkg.title}
                </h3>
                <div className="font-mono text-xs text-[var(--text3)] mb-4">
                  $ pip install {pkg.slug}
                </div>
                <p className="text-[var(--text2)] leading-relaxed mb-8">
                  {pkg.description}
                </p>
              </div>

              {/* Footer: Publishers */}
              <div className="relative z-10 pt-6 border-t border-[var(--border)]">
                <div className="flex flex-wrap gap-3">
                  {pkg.publishers?.map((pub, idx) => (
                    <a 
                      key={idx}
                      href={pub.platform_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-xs font-mono hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all"
                    >
                      {pub.icon_class && <i className={pub.icon_class}></i>}
                      {pub.platform_name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
