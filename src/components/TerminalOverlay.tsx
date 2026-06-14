'use client';

import React from 'react';
import { useTerminal } from '../context/TerminalContext';

export default function TerminalOverlay() {
  const { isTerminalActive, terminalLines, typedCommand, closeTerminalEarly } = useTerminal();

  if (!isTerminalActive) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeTerminalEarly();
    }
  };

  return (
    <div
      id="terminal-overlay"
      className="active"
      onClick={handleBackdropClick}
      role="dialog"
      aria-label="Linux Terminal Command Animation"
    >
      <div id="terminal-window">
        <div id="terminal-titlebar">
          <div className="term-dots">
            <button className="dot dot-red" onClick={closeTerminalEarly} aria-label="Close terminal"></button>
            <span className="dot dot-yellow"></span>
            <span className="dot dot-green"></span>
          </div>
          <span className="term-title">rahul-baberwal@portfolio — bash</span>
        </div>
        <div id="terminal-body" className="font-mono text-sm leading-relaxed">
          {/* Output lines */}
          <div id="terminal-output">
            {terminalLines.map((line, idx) => {
              if (line.cls === 'dim') {
                return (
                  <div key={idx} className="term-output-line dim">
                    <span style={{ color: '#28c840' }}>rahul-baberwal<span style={{ color: 'rgba(255,255,255,.35)' }}>@</span>portfolio</span>
                    <span style={{ color: 'rgba(255,255,255,.3)' }}>:</span>
                    <span style={{ color: '#58a6ff' }}>~/website</span>
                    <span style={{ color: 'rgba(255,255,255,.4)' }}>$ </span>
                    <span style={{ color: '#f0f0fa' }}>
                      {line.text.startsWith('git ') ? (
                        <>
                          <span style={{ color: '#febc2e' }}>git</span> {line.text.slice(4)}
                        </>
                      ) : line.text.startsWith('curl ') ? (
                        <>
                          <span style={{ color: '#febc2e' }}>curl</span> {line.text.slice(5)}
                        </>
                      ) : (
                        line.text
                      )}
                    </span>
                  </div>
                );
              } else if (line.cls === 'arrow') {
                return (
                  <div key={idx} className="term-output-line arrow flex items-center gap-2">
                    <span className="opacity-60 text-[10px]">&#10142;</span>
                    <span>{line.text.replace('→ ', '')}</span>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className={`term-output-line ${line.cls}`}>
                    {line.text}
                  </div>
                );
              }
            })}
          </div>

          {/* Typing Prompt line */}
          <div id="terminal-prompt-line">
            <span className="term-user">
              rahul-baberwal<span className="term-at">@</span>portfolio
            </span>
            <span className="term-colon">:</span>
            <span className="term-path">~/website</span>
            <span className="term-dollar">$</span>
            <span id="terminal-cmd" className="text-[#f0f0fa] pl-2">
              {typedCommand.startsWith('git ') ? (
                <>
                  <span className="text-[#febc2e]">git</span>
                  {typedCommand.slice(3)}
                </>
              ) : (
                typedCommand
              )}
            </span>
            <span className="term-cursor animate-pulse">█</span>
          </div>
        </div>
      </div>
    </div>
  );
}
