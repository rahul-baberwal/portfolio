'use client';

import React, { createContext, useContext, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface TerminalLine {
  text: string;
  cls: 'dim' | 'ok' | 'info' | 'arrow' | 'branch';
}

interface TerminalContextType {
  isTerminalActive: boolean;
  terminalLines: TerminalLine[];
  typedCommand: string;
  triggerTerminalNav: (sectionId: string, scrollTargetId?: string) => Promise<void>;
  runSocialTerminal: (socialKey: 'github' | 'gitlab' | 'linkedin' | 'facebook' | 'email') => Promise<void>;
  closeTerminalEarly: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

// git checkouts per section
const gitLines: Record<string, TerminalLine[]> = {
  about: [
    { text: "git checkout about", cls: "dim" },
    { text: "Switched to branch 'about'", cls: "ok" },
    { text: "Branch 'about' set up to track 'origin/about'.", cls: "info" },
    { text: "→ Loading profile data...", cls: "arrow" },
  ],
  skills: [
    { text: "git checkout skills", cls: "dim" },
    { text: "Switched to branch 'skills'", cls: "ok" },
    { text: "Merging stack: python django fastapi docker redis...", cls: "info" },
    { text: "→ Skill bars ready", cls: "arrow" },
  ],
  projects: [
    { text: "git checkout projects", cls: "dim" },
    { text: "Switched to branch 'projects'", cls: "ok" },
    { text: "3 featured commits found.", cls: "info" },
    { text: "→ Rendering project cards...", cls: "arrow" },
  ],
  experience: [
    { text: "git checkout experience", cls: "dim" },
    { text: "Switched to branch 'experience'", cls: "ok" },
    { text: "git log --oneline -4", cls: "dim" },
    { text: "a3f12c0  Mohta College, MGSU Bikaner — MSc CS", cls: "branch" },
    { text: "9b2e441  Groww Per Click — Backend Dev", cls: "branch" },
    { text: "→ Timeline loaded", cls: "arrow" },
  ],
  contact: [
    { text: "git checkout contact", cls: "dim" },
    { text: "Switched to branch 'contact'", cls: "ok" },
    { text: "remote: im@rahulbaberwal.com", cls: "info" },
    { text: "→ Opening communication channel...", cls: "arrow" },
  ],
};

const socialScripts: Record<string, { url: string; lines: TerminalLine[] }> = {
  github: {
    url: 'https://github.com/rahul-baberwal',
    lines: [
      { text: 'git remote -v', cls: 'dim' },
      { text: 'origin  https://github.com/rahul-baberwal (fetch)', cls: 'info' },
      { text: 'origin  https://github.com/rahul-baberwal (push)', cls: 'info' },
      { text: 'git remote show origin', cls: 'dim' },
      { text: '* remote origin', cls: 'ok' },
      { text: '  Fetch URL: github.com/rahul-baberwal', cls: 'branch' },
      { text: '  HEAD branch: main', cls: 'branch' },
      { text: '→ Opening GitHub profile...', cls: 'arrow' },
    ],
  },
  gitlab: {
    url: 'https://gitlab.com/rahul-baberwal',
    lines: [
      { text: 'git remote add gitlab https://gitlab.com/rahul-baberwal', cls: 'dim' },
      { text: 'git push gitlab main', cls: 'dim' },
      { text: 'Enumerating objects: done.', cls: 'ok' },
      { text: 'Writing objects: 100% | 42 objects pushed', cls: 'info' },
      { text: 'Branch main → gitlab/main', cls: 'branch' },
      { text: '→ Opening GitLab profile...', cls: 'arrow' },
    ],
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/rahul-baberwal/',
    lines: [
      { text: 'curl -sI https://linkedin.com/in/rahul-baberwal', cls: 'dim' },
      { text: 'HTTP/2 200', cls: 'ok' },
      { text: 'content-type: text/html; charset=utf-8', cls: 'info' },
      { text: 'x-profile: rahul-baberwal | MSc CS @ Mohta College', cls: 'branch' },
      { text: 'x-status: open-to-work ✓', cls: 'ok' },
      { text: '→ Opening LinkedIn profile...', cls: 'arrow' },
    ],
  },
  facebook: {
    url: 'https://www.facebook.com/rahulbaberwal.in/',
    lines: [
      { text: 'curl -sI https://facebook.com/rahulbaberwal.in/', cls: 'dim' },
      { text: 'HTTP/2 200 OK', cls: 'ok' },
      { text: 'content-type: text/html; charset=utf-8', cls: 'info' },
      { text: 'x-profile: rahulbaberwal.in | Facebook Page', cls: 'branch' },
      { text: '→ Opening Facebook profile...', cls: 'arrow' },
    ],
  },
  email: {
    url: 'mailto:im@rahulbaberwal.com',
    lines: [
      { text: 'mail -s "Hello Rahul" im@rahulbaberwal.com', cls: 'dim' },
      { text: 'Resolving MX for rahulbaberwal.com... done', cls: 'info' },
      { text: 'SMTP: connected to mx.rahulbaberwal.com:587', cls: 'ok' },
      { text: 'To: im@rahulbaberwal.com', cls: 'branch' },
      { text: 'Status: READY TO SEND', cls: 'ok' },
      { text: '→ Launching mail client...', cls: 'arrow' },
    ],
  },
};

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTerminalActive, setIsTerminalActive] = useState<boolean>(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [typedCommand, setTypedCommand] = useState<string>('');
  const activeRef = useRef<boolean>(false);

  const closeTerminalEarly = () => {
    setIsTerminalActive(false);
    activeRef.current = false;
    setTerminalLines([]);
    setTypedCommand('');
  };

  const typeCommand = (cmd: string): Promise<void> => {
    return new Promise((resolve) => {
      setTypedCommand('');
      let i = 0;
      const speed = 30; // Type speed
      function nextChar() {
        if (!activeRef.current) return;
        if (i < cmd.length) {
          setTypedCommand((prev) => prev + cmd[i++]);
          setTimeout(nextChar, speed + (Math.random() * 20 - 10));
        } else {
          resolve();
        }
      }
      setTimeout(nextChar, 100);
    });
  };

  const addLineWithDelay = (line: TerminalLine, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!activeRef.current) return;
        setTerminalLines((prev) => [...prev, line]);
        resolve();
      }, delay);
    });
  };

  const triggerTerminalNav = async (sectionId: string, scrollTargetId?: string) => {
    if (activeRef.current) return;
    activeRef.current = true;
    setIsTerminalActive(true);
    setTerminalLines([]);
    setTypedCommand('');

    const targetScrollId = scrollTargetId || sectionId;
    const commandText = `git checkout ${sectionId}`;
    
    // Type the git checkout command
    await typeCommand(commandText);
    await new Promise((r) => setTimeout(r, 150));
    
    // Wipe current typed command (simulate pressing enter)
    setTypedCommand('');

    // Fetch and display lines
    const lines = gitLines[sectionId] || [
      { text: `git checkout ${sectionId}`, cls: 'dim' },
      { text: `Switched to branch '${sectionId}'`, cls: 'ok' },
    ];

    for (const line of lines) {
      const wait = line.cls === 'dim' ? 80 : 150;
      await addLineWithDelay(line, 0);
      await new Promise((r) => setTimeout(r, wait));
    }

    await new Promise((r) => setTimeout(r, 380));

    if (!activeRef.current) return;
    setIsTerminalActive(false);
    activeRef.current = false;

    // Execute scroll or redirect
    setTimeout(() => {
      if (pathname !== '/') {
        // If not on home page, redirect to home page with hash
        router.push(`/#${targetScrollId}`);
      } else {
        const el = document.getElementById(targetScrollId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);
  };

  const runSocialTerminal = async (socialKey: 'github' | 'gitlab' | 'linkedin' | 'facebook' | 'email') => {
    if (activeRef.current) return;
    activeRef.current = true;
    setIsTerminalActive(true);
    setTerminalLines([]);
    setTypedCommand('');

    const script = socialScripts[socialKey];
    if (!script) return;

    // Type the first command in the script
    const firstCmd = script.lines[0].text;
    await typeCommand(firstCmd);
    await new Promise((r) => setTimeout(r, 150));
    setTypedCommand('');

    for (const line of script.lines) {
      const wait = line.cls === 'dim' ? 80 : 120;
      await addLineWithDelay(line, 0);
      await new Promise((r) => setTimeout(r, wait));
    }

    await new Promise((r) => setTimeout(r, 350));

    if (!activeRef.current) return;
    setIsTerminalActive(false);
    activeRef.current = false;

    setTimeout(() => {
      if (script.url.startsWith('mailto:')) {
        window.location.href = script.url;
      } else {
        window.open(script.url, '_blank', 'noopener,noreferrer');
      }
    }, 150);
  };

  return (
    <TerminalContext.Provider
      value={{
        isTerminalActive,
        terminalLines,
        typedCommand,
        triggerTerminalNav,
        runSocialTerminal,
        closeTerminalEarly,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
