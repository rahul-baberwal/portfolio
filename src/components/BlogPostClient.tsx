'use client';

import React, { useEffect, useState } from 'react';

interface BlogPostClientProps {
  children: React.ReactNode;
  title: string;
  excerpt: string;
}

export default function BlogPostClient({ children, title, excerpt }: BlogPostClientProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // 2. Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Social Sharing Utilities
  const getShareUrls = () => {
    if (typeof window === 'undefined') return { twitter: '', linkedin: '', facebook: '', reddit: '', quora: '', dev: '' };
    const url = encodeURIComponent(window.location.href);
    const encTitle = encodeURIComponent(title);
    const encDesc = encodeURIComponent(excerpt);
    const tags = "WebSecurity,SEO,Backend,WebDev";

    return {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${encTitle}%20-%20${encDesc}&hashtags=${tags}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${encTitle}%20-%20${encDesc}`,
      quora: `https://www.quora.com/share?url=${url}&title=${encTitle}`,
      dev: `https://dev.to/new?prefill_url=${url}&title=${encTitle}`,
    };
  };

  const handleShareClick = (e: React.MouseEvent<HTMLAnchorElement>, shareUrl: string) => {
    e.preventDefault();
    if (!shareUrl) return;
    window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const shares = getShareUrls();

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[var(--accent)] z-[9999] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Scroll-to-top FAB */}
      {showTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-top-btn"
          aria-label="Back to top"
          title="Back to top"
        >
          <i className="fa-solid fa-chevron-up"></i>
        </button>
      )}

      {children}

      {/* Bottom Share Section */}
      <section className="article-share-section select-none">
        <h3 className="share-title font-mono text-sm uppercase tracking-wider">Share this article</h3>
        <div className="share-buttons">
          <a
            href="#"
            onClick={(e) => handleShareClick(e, shares.twitter)}
            className="share-btn twitter"
          >
            <i className="fa-brands fa-x-twitter"></i>
            <span>Twitter / X</span>
          </a>
          <a
            href="#"
            onClick={(e) => handleShareClick(e, shares.linkedin)}
            className="share-btn linkedin"
          >
            <i className="fa-brands fa-linkedin-in"></i>
            <span>LinkedIn</span>
          </a>
          <a
            href="#"
            onClick={(e) => handleShareClick(e, shares.facebook)}
            className="share-btn facebook"
          >
            <i className="fa-brands fa-facebook-f"></i>
            <span>Facebook</span>
          </a>
          <a
            href="#"
            onClick={(e) => handleShareClick(e, shares.reddit)}
            className="share-btn reddit"
          >
            <i className="fa-brands fa-reddit-alien"></i>
            <span>Reddit</span>
          </a>
          <a
            href="#"
            onClick={(e) => handleShareClick(e, shares.quora)}
            className="share-btn quora"
          >
            <i className="fa-brands fa-quora"></i>
            <span>Quora</span>
          </a>
          <a
            href="#"
            onClick={(e) => handleShareClick(e, shares.dev)}
            className="share-btn dev"
          >
            <i className="fa-brands fa-dev"></i>
            <span>DEV.to</span>
          </a>
          <button onClick={handleCopyLink} className="share-btn copy">
            {copiedLink ? (
              <>
                <i className="fa-solid fa-check text-green-400"></i>
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-link"></i>
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </section>
    </>
  );
}
