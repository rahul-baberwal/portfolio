'use client';

import React, { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  // Check if it's the first load. On server, assume it is.
  const [isFirstLoad] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('hasLoaded');
    }
    return true;
  });

  const [animating, setAnimating] = useState(!isFirstLoad);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isFirstLoad) {
      sessionStorage.setItem('hasLoaded', 'true');
    } else {
      // Trigger the slide up animation for subsequent loads
      const timer = setTimeout(() => {
        setAnimating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  return (
    <>
      {!isFirstLoad && (
        <div className={`page-swipe-loader ${!animating ? 'slide-up' : ''}`}>
          <div className="swipe-content">
            <div className="swipe-orb"></div>
            <div className="swipe-logo">rb<span>.</span></div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
