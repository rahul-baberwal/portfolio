'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTerminal } from '../context/TerminalContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { triggerTerminalNav } = useTerminal();
  
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Track active section for anchor links on home page
      if (pathname === '/') {
        const sections = ['about', 'skills', 'projects', 'experience', 'contact'];
        let current = '';
        
        for (const secId of sections) {
          const el = document.getElementById(secId);
          if (el && window.scrollY >= el.offsetTop - 220) {
            current = secId;
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleBlogClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-logo cursor-pointer" onClick={() => router.push('/')}>
        rb<span>.</span>
      </div>

      {/* Desktop Links */}
      <ul className="nav-links hidden md:flex">
        <li>
          <Link
            href="/#about"
            onClick={handleNavClick}
            style={{ color: activeSection === 'about' ? 'var(--accent)' : '' }}
          >
            about
          </Link>
        </li>
        <li>
          <Link
            href="/#skills"
            onClick={handleNavClick}
            style={{ color: activeSection === 'skills' ? 'var(--accent)' : '' }}
          >
            skills
          </Link>
        </li>
        <li>
          <Link
            href="/#projects"
            onClick={handleNavClick}
            style={{ color: activeSection === 'projects' ? 'var(--accent)' : '' }}
          >
            projects
          </Link>
        </li>
        <li>
          <Link
            href="/#experience"
            onClick={handleNavClick}
            style={{ color: activeSection === 'experience' ? 'var(--accent)' : '' }}
          >
            experience
          </Link>
        </li>
        <li>
          <Link
            href="/#contact"
            onClick={handleNavClick}
            style={{ color: activeSection === 'contact' ? 'var(--accent)' : '' }}
          >
            contact
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            onClick={handleBlogClick}
            style={{ color: pathname.startsWith('/blog') ? 'var(--accent)' : '' }}
          >
            blog
          </Link>
        </li>
      </ul>

      {/* Hamburger Toggle */}
      <button
        id="hamburger"
        className={`md:hidden ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div id="mobile-menu" className={`${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-links">
          <li>
            <Link href="/" onClick={handleNavClick}>
              home
            </Link>
          </li>
          <li>
            <Link href="/#about" onClick={handleNavClick}>
              about
            </Link>
          </li>
          <li>
            <Link href="/#skills" onClick={handleNavClick}>
              skills
            </Link>
          </li>
          <li>
            <Link href="/#projects" onClick={handleNavClick}>
              projects
            </Link>
          </li>
          <li>
            <Link href="/#experience" onClick={handleNavClick}>
              experience
            </Link>
          </li>
          <li>
            <Link href="/#contact" onClick={handleNavClick}>
              contact
            </Link>
          </li>
          <li>
            <Link href="/blog" onClick={handleBlogClick}>
              blog
            </Link>
          </li>
        </ul>
        <div className="mobile-socials">
          <button className="social-link" onClick={() => triggerTerminalNav('github')} title="GitHub">
            <i className="fa-brands fa-github text-[18px]"></i>
          </button>
          <button className="social-link" onClick={() => triggerTerminalNav('linkedin')} title="LinkedIn">
            <i className="fa-brands fa-linkedin-in text-[18px]"></i>
          </button>
          <button className="social-link" onClick={() => triggerTerminalNav('email')} title="Email">
            <i className="fa-regular fa-envelope text-[18px]"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
