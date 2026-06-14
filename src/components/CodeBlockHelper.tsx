'use client';

import { useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export default function CodeBlockHelper() {
  useEffect(() => {
    // 1. Run syntax highlighting
    hljs.highlightAll();

    // 2. Append Copy Buttons to all code blocks
    const codeBlocks = document.querySelectorAll('.article-content pre');
    
    codeBlocks.forEach((pre) => {
      const code = pre.querySelector('code');
      if (!code || pre.querySelector('.copy-btn')) return;

      // Make sure parent is relative for absolute button placement
      (pre as HTMLElement).style.position = 'relative';

      // Create Copy Button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      // Use font-awesome icon and text
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
      
      pre.appendChild(copyBtn);

      copyBtn.addEventListener('click', () => {
        const text = code.innerText;
        
        const flashCopied = () => {
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
          }, 1800);
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(flashCopied).catch(() => {
            fallbackCopy(text);
            flashCopied();
          });
        } else {
          fallbackCopy(text);
          flashCopied();
        }
      });
    });

    function fallbackCopy(text: string) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0;';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        // Fallback catch block
      }
      ta.remove();
    }
  }, []);

  return null;
}
