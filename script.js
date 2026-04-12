// Custom cursor
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top = my - 6 + 'px';
});

function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx - 20 + 'px';
  trail.style.top = ty - 20 + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2)';
    cursor.style.background = '#ff6584';
    trail.style.transform = 'scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    cursor.style.background = 'var(--accent)';
    trail.style.transform = 'scale(1)';
  });
});

// Particles
function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  const x = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 5;
  const colors = ['#6c63ff', '#ff6584', '#43e97b'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  p.style.cssText = `
    width:${size}px;height:${size}px;
    left:${x}vw;
    background:${color};
    animation-duration:${duration}s;
    animation-delay:${delay}s;
    opacity:0.4;
  `;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), (duration + delay) * 1000);
}

setInterval(createParticle, 800);
for (let i = 0; i < 8; i++) setTimeout(createParticle, i * 200);

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

// Skill card cursor glow
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// Nav active state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });

  // Shrink nav on scroll
  const nav = document.querySelector('nav');
  nav.style.padding = window.scrollY > 50 ? '1rem 4rem' : '1.5rem 4rem';
});

// Typewriter effect
const roles = [
  'Aspiring Data Scientist',
  'Backend Developer',
  'ML Engineer',
  'AI Enthusiast',
  'Django Developer',
];
let roleIndex = 0, charIndex = 0, deleting = false;
const typer = document.getElementById('typewriter');

function type() {
  const current = roles[roleIndex];
  if (!deleting) {
    typer.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typer.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 50 : 80);
}
type();

// ─── Linux Terminal Navigation ────────────────────────────────────────────────

const termOverlay  = document.getElementById('terminal-overlay');
const termOutput   = document.getElementById('terminal-output');
const termCmd      = document.getElementById('terminal-cmd');

// Git output lines per section — feels like a real repo
const gitLines = {
  about: [
    { text: "git checkout about",            cls: "dim",    prompt: true  },
    { text: "Switched to branch 'about'",    cls: "ok"                    },
    { text: "Branch 'about' set up to track 'origin/about'.", cls: "info" },
    { text: "→ Loading profile data...",     cls: "arrow"                 },
  ],
  skills: [
    { text: "git checkout skills",           cls: "dim",    prompt: true  },
    { text: "Switched to branch 'skills'",   cls: "ok"                    },
    { text: "Merging stack: python django fastapi docker redis...", cls: "info" },
    { text: "→ Skill bars ready",            cls: "arrow"                 },
  ],
  projects: [
    { text: "git checkout projects",         cls: "dim",    prompt: true  },
    { text: "Switched to branch 'projects'", cls: "ok"                    },
    { text: "3 featured commits found.",     cls: "info"                  },
    { text: "→ Rendering project cards...",  cls: "arrow"                 },
  ],
  experience: [
    { text: "git checkout experience",       cls: "dim",    prompt: true  },
    { text: "Switched to branch 'experience'", cls: "ok"                  },
    { text: "git log --oneline -4",          cls: "dim",    prompt: true  },
    { text: "a3f12c0  IIT Ropar — MSc CS",   cls: "branch"               },
    { text: "9b2e441  Groww Per Click — Backend Dev", cls: "branch"       },
    { text: "→ Timeline loaded",             cls: "arrow"                 },
  ],
  contact: [
    { text: "git checkout contact",          cls: "dim",    prompt: true  },
    { text: "Switched to branch 'contact'",  cls: "ok"                   },
    { text: "remote: rahulbaberwal3@gmail.com", cls: "info"               },
    { text: "→ Opening communication channel...", cls: "arrow"            },
  ],
};

let termActive = false;

function addOutputLine(text, cls, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = `term-output-line ${cls}`;
      // prompt lines get the full prompt prefix
      if (cls === 'dim') {
        line.innerHTML =
          `<span style="color:#28c840">rahul-baberwal<span style="color:rgba(255,255,255,.35)">@</span>portfolio</span>` +
          `<span style="color:rgba(255,255,255,.3)">:</span>` +
          `<span style="color:#58a6ff">~/website</span>` +
          `<span style="color:rgba(255,255,255,.4)">$</span> ` +
          `<span style="color:#f0f0fa">${text.replace(/^git /, '<span style="color:#febc2e">git</span> ')}</span>`;
      } else if (cls === 'arrow') {
        line.innerHTML = `<i class="fa-solid fa-arrow-right-long" style="margin-right:8px; font-size:0.75rem; opacity:0.6;"></i>${text.replace('→ ', '')}`;
      } else {
        line.textContent = text;
      }
      termOutput.appendChild(line);
      resolve();
    }, delay);
  });
}

function typeCommand(cmd) {
  return new Promise(resolve => {
    termCmd.textContent = '';
    let i = 0;
    const speed = 38; // ms per character
    function nextChar() {
      if (i < cmd.length) {
        termCmd.textContent += cmd[i++];
        setTimeout(nextChar, speed + (Math.random() * 20 - 10));
      } else {
        resolve();
      }
    }
    setTimeout(nextChar, 120); // slight pause before typing starts
  });
}

async function runTerminal(sectionId, targetEl) {
  if (termActive) return;
  termActive = true;

  const lines = gitLines[sectionId] || [
    { text: `git checkout ${sectionId}`, cls: 'dim', prompt: true },
    { text: `Switched to branch '${sectionId}'`, cls: 'ok' },
  ];

  // Clear previous output
  termOutput.innerHTML = '';
  termCmd.textContent  = '';

  // Show overlay
  termOverlay.classList.add('active');

  // Type the command into the active prompt line
  const cmdText = `git checkout ${sectionId}`;
  await typeCommand(cmdText);

  // Small pause — like pressing Enter
  await new Promise(r => setTimeout(r, 180));

  // Hide the typing prompt (we'll show it as a dim history line)
  termCmd.textContent = '';

  // Print output lines with staggered delays
  let delay = 0;
  for (const line of lines) {
    delay += line.prompt ? 80 : 160;
    await addOutputLine(line.text, line.cls, 0);
    await new Promise(r => setTimeout(r, line.prompt ? 80 : 160));
  }

  // Final pause, then navigate
  await new Promise(r => setTimeout(r, 420));

  // Dismiss terminal
  termOverlay.classList.remove('active');
  termActive = false;

  // Scroll to section
  setTimeout(() => {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 200);
}

// Intercept ALL internal anchor clicks
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href   = a.getAttribute('href');
    const target = document.querySelector(href);
    const sectionId = href.replace('#', '');

    if (target) {
      e.preventDefault();
      // Only trigger terminal for known nav sections
      if (gitLines[sectionId] !== undefined) {
        runTerminal(sectionId, target);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Click backdrop to dismiss early (escape hatch)
termOverlay.addEventListener('click', (e) => {
  if (e.target === termOverlay) {
    termOverlay.classList.remove('active');
    termActive = false;
  }
});

// ─── Social Link Terminal ─────────────────────────────────────────────────────
// Terminal scripts for each external social/email link

const socialScripts = {
  github: {
    match: /github\.com/,
    url: 'https://github.com/rahul-baberwal',
    lines: [
      { text: 'git remote -v',                                          cls: 'dim',    prompt: true },
      { text: 'origin  https://github.com/rahul-baberwal (fetch)',      cls: 'info' },
      { text: 'origin  https://github.com/rahul-baberwal (push)',       cls: 'info' },
      { text: 'git remote show origin',                                  cls: 'dim',    prompt: true },
      { text: '* remote origin',                                         cls: 'ok'   },
      { text: '  Fetch URL: github.com/rahul-baberwal',                  cls: 'branch' },
      { text: '  HEAD branch: main',                                     cls: 'branch' },
      { text: '→ Opening GitHub profile...',                             cls: 'arrow' },
    ],
  },
  gitlab: {
    match: /gitlab\.com/,
    url: 'https://gitlab.com/rahul-baberwal',
    lines: [
      { text: 'git remote add gitlab https://gitlab.com/rahul-baberwal', cls: 'dim',   prompt: true },
      { text: 'git push gitlab main',                                     cls: 'dim',   prompt: true },
      { text: 'Enumerating objects: done.',                               cls: 'ok'   },
      { text: 'Writing objects: 100% | 42 objects pushed',                cls: 'info' },
      { text: 'Branch main → gitlab/main',                                cls: 'branch' },
      { text: '→ Opening GitLab profile...',                              cls: 'arrow' },
    ],
  },
  linkedin: {
    match: /linkedin\.com/,
    url: 'https://www.linkedin.com/in/rahul-baberwal/',
    lines: [
      { text: 'curl -sI https://linkedin.com/in/rahul-baberwal',         cls: 'dim',   prompt: true },
      { text: 'HTTP/2 200',                                               cls: 'ok'   },
      { text: 'content-type: text/html; charset=utf-8',                  cls: 'info' },
      { text: 'x-profile: rahul-baberwal | MSc CS @ IIT Ropar',          cls: 'branch' },
      { text: 'x-status: open-to-work ✓',                                cls: 'ok'   },
      { text: '→ Opening LinkedIn profile...',                            cls: 'arrow' },
    ],
  },
  email: {
    match: /mailto:/,
    url: 'mailto:rahulbaberwal3@gmail.com',
    lines: [
      { text: 'mail -s "Hello Rahul" rahulbaberwal3@gmail.com',          cls: 'dim',   prompt: true },
      { text: 'Resolving MX for gmail.com... done',                       cls: 'info' },
      { text: 'SMTP: connected to smtp.gmail.com:587',                    cls: 'ok'   },
      { text: 'To: rahulbaberwal3@gmail.com',                             cls: 'branch' },
      { text: 'Status: READY TO SEND',                                    cls: 'ok'   },
      { text: '→ Launching mail client...',                               cls: 'arrow' },
    ],
  },
};

async function runSocialTerminal(script) {
  if (termActive) return;
  termActive = true;

  termOutput.innerHTML = '';
  termCmd.textContent  = '';
  termOverlay.classList.add('active');

  // Type just the first command (the most recognisable one)
  const firstCmd = script.lines[0].text;
  await typeCommand(firstCmd);
  await new Promise(r => setTimeout(r, 180));
  termCmd.textContent = '';

  // Print all lines
  for (const line of script.lines) {
    await addOutputLine(line.text, line.cls, 0);
    await new Promise(r => setTimeout(r, line.prompt ? 90 : 150));
  }

  await new Promise(r => setTimeout(r, 380));

  termOverlay.classList.remove('active');
  termActive = false;

  // Open in new tab (or same tab for mailto)
  setTimeout(() => {
    if (script.url.startsWith('mailto:')) {
      window.location.href = script.url;
    } else {
      window.open(script.url, '_blank', 'noopener,noreferrer');
    }
  }, 200);
}

// Intercept all social/external link clicks
document.querySelectorAll('a.social-link, a.contact-social-link, .contact-email').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href') || '';

    for (const key of Object.keys(socialScripts)) {
      const script = socialScripts[key];
      if (script.match.test(href)) {
        e.preventDefault();
        runSocialTerminal(script);
        return;
      }
    }
    // mailto on contact-email link
    if (href.startsWith('mailto:')) {
      e.preventDefault();
      runSocialTerminal(socialScripts.email);
    }
  });
});

// Counter animation for stats
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + el.dataset.suffix; clearInterval(timer); return; }
    el.textContent = Math.floor(start) + el.dataset.suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, +entry.target.dataset.count, 1500);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ─── AUTO-SCROLL ──────────────────────────────────────────────────────────────
// Starts 5 seconds after page load (or after last user interaction).
// Clicking anywhere STOPS the scroll immediately.
// After 5 seconds of no clicks, it restarts automatically.

let autoScrollActive = false;
let autoScrollRAF = null;
let inactivityTimer = null;
const AUTO_SCROLL_SPEED = 0.6;    // px per frame (~36px/sec at 60fps)
const INACTIVITY_DELAY = 5000;    // ms of no activity before auto-scroll starts

function startAutoScroll() {
  if (autoScrollActive) return;
  autoScrollActive = true;

  function scrollStep() {
    if (!autoScrollActive) return;

    const maxScroll = document.body.scrollHeight - window.innerHeight;

    // If we've reached the very bottom, loop back to top
    if (window.scrollY >= maxScroll - 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Give the smooth scroll a moment, then continue
      setTimeout(() => {
        if (autoScrollActive) autoScrollRAF = requestAnimationFrame(scrollStep);
      }, 800);
      return;
    }

    window.scrollBy(0, AUTO_SCROLL_SPEED);
    autoScrollRAF = requestAnimationFrame(scrollStep);
  }

  autoScrollRAF = requestAnimationFrame(scrollStep);
}

function stopAutoScroll() {
  autoScrollActive = false;
  if (autoScrollRAF) {
    cancelAnimationFrame(autoScrollRAF);
    autoScrollRAF = null;
  }
}

function resetInactivityTimer() {
  // Stop auto-scroll immediately
  stopAutoScroll();

  // Clear any pending restart timer
  clearTimeout(inactivityTimer);

  // Schedule restart after INACTIVITY_DELAY ms of no activity
  inactivityTimer = setTimeout(() => {
    startAutoScroll();
  }, INACTIVITY_DELAY);
}

// Listen to all user activity events
['click', 'touchstart', 'keydown', 'wheel', 'pointerdown'].forEach(evt => {
  window.addEventListener(evt, resetInactivityTimer, { passive: true });
});

// Also stop on mouse scroll (user is scrolling manually)
window.addEventListener('scroll', () => {
  // Only reset timer if scroll was caused by user (not auto-scroll itself)
  // We can't distinguish perfectly, so we just reset the timer on scroll
  // but don't stop the active auto-scroll on scroll events
  // (it would fight itself). Only clicks/touches stop it.
}, { passive: true });

// Start the inactivity timer on page load
resetInactivityTimer();

// ─── THEMES (Logic now moved to <head> for early load) ──────────────────────────

function cycleTheme() {
  // Use global themes from window
  const themes = window.themes;
  if (!themes) return;

  // Pick a random theme that is DIFFERENT from the current one
  let next;
  do {
    next = Math.floor(Math.random() * themes.length);
  } while (next === window.currentThemeIndex);
  
  if (window.applyTheme) {
    window.applyTheme(next);
  }

  // White flash overlay for the visual "snap" moment
  const flash = document.createElement('div');
  flash.className = 'theme-flash-overlay';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 450);
}

// ─── MOTION & GYROSCOPE CORE ──────────────────────────────────────────────────
const motion = { x: 0, y: 0, z: 0, tx: 0, ty: 0, tz: 0 };
let hasGyro = false;
let lastShake = 0;
let initialZ = null;
let initialY = null;

// Check for secure context
if (location.protocol !== 'https:' && location.hostname !== 'localhost' && !location.hostname.startsWith('127.0.0.')) {
  console.warn('RAHUL LOG: Gyroscope requires HTTPS to function on mobile devices.');
}

// Throttle CSS var updates to avoid thrashing layout every frame
let lastGx = 0, lastGy = 0, lastGz = 0;
const GZ_THRESHOLD = 0.3;

function updateMotionVars() {
  // Smoothly interpolate current motion values
  motion.tx += (motion.x - motion.tx) * 0.08;
  motion.ty += (motion.y - motion.ty) * 0.08;

  // Shortest path interpolation for Z (Compass) — only when real gyro active
  if (hasGyro) {
    let dz = motion.z - motion.tz;
    if (dz > 180) dz -= 360;
    if (dz < -180) dz += 360;
    motion.tz += dz * 0.08;
  } else {
    motion.tz += (0 - motion.tz) * 0.05;
  }

  const gx = +motion.tx.toFixed(3);
  const gy = +motion.ty.toFixed(3);
  const gz = +(motion.tz % 360).toFixed(1);

  if (Math.abs(gx - lastGx) > 0.005) {
    document.documentElement.style.setProperty('--gx', gx);
    lastGx = gx;
  }
  if (Math.abs(gy - lastGy) > 0.005) {
    document.documentElement.style.setProperty('--gy', gy);
    lastGy = gy;
  }
  if (Math.abs(gz - lastGz) > GZ_THRESHOLD) {
    document.documentElement.style.setProperty('--gz', gz);
    lastGz = gz;
  }

  requestAnimationFrame(updateMotionVars);
}
updateMotionVars();

const handleOrientation = (e) => {
  if (e.beta === null || e.gamma === null) return;
  hasGyro = true;

  let alpha = e.alpha;
  if (e.webkitCompassHeading) {
    alpha = 360 - e.webkitCompassHeading;
  } else if (e.absolute) {
    alpha = e.alpha;
  }

  if (initialZ === null && alpha !== null) {
    initialZ = alpha;
    initialY = e.beta;
  }

  motion.x = Math.max(-1, Math.min(1, e.gamma / 45));
  motion.y = Math.max(-1, Math.min(1, (e.beta - initialY) / 45));
  if (alpha !== null) motion.z = alpha - initialZ;
};

// Shake Detection Logic
const handleMotion = (e) => {
  const acc = e.accelerationIncludingGravity;
  if (!acc) return;
  const total = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
  const now = Date.now();

  if (total > 25 && now - lastShake > 1500) {
    lastShake = now;
    triggerShakeEffect();
  }
};

function triggerShakeEffect() {
  // 1. Glitch animation
  document.body.classList.add('glitch-active');

  // 2. Particle burst immediately
  particleBurst();

  // 3. After glitch finishes (~600ms), change theme
  setTimeout(() => {
    document.body.classList.remove('glitch-active');
    cycleTheme();
  }, 600);
}

function particleBurst() {
  const themeAccents = ['var(--accent)', 'var(--accent2)', 'var(--accent3)'];
  const rawColors = ['#6c63ff', '#ff6584', '#43e97b']; // fallback

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle-burst';
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 10 + 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    p.style.setProperty('--vx', vx + 'vw');
    p.style.setProperty('--vy', vy + 'vh');
    p.style.background = rawColors[Math.floor(Math.random() * 3)];

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

// Desktop Mouse Fallback
window.addEventListener('mousemove', (e) => {
  if (hasGyro) return;
  motion.x = (e.clientX / window.innerWidth - 0.5) * 2;
  motion.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Activation logic
const activateMotion = () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(res => {
      if (res === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('deviceorientationabsolute', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);
      }
    });
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('deviceorientationabsolute', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);
  }
};

window.addEventListener('click', activateMotion, { once: true });
window.addEventListener('touchstart', activateMotion, { once: true });

// ─── Custom Right-Click Context Menu ──────────────────────────────────────────

const ctxMenu = document.getElementById('ctx-menu');
let ctxVisible = false;

// Reliable copy fallback for non-HTTPS environments
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-999px;left:-999px;opacity:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch (e) { /* silent */ }
  ta.remove();
}

function showCtxMenu(x, y) {
  // Stop auto-scroll while menu is open
  stopAutoScroll();
  clearTimeout(inactivityTimer);

  // Reset classes
  ctxMenu.classList.remove('flip-x', 'flip-y', 'visible');

  // Position offscreen first to measure
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top  = y + 'px';

  // Force a reflow so we can measure the element
  void ctxMenu.offsetWidth;

  const menuW = ctxMenu.offsetWidth;
  const menuH = ctxMenu.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Flip if too close to right/bottom edge
  let finalX = x;
  let finalY = y;

  if (x + menuW > vw - 12) {
    finalX = x - menuW;
    ctxMenu.classList.add('flip-x');
  }
  if (y + menuH > vh - 12) {
    finalY = y - menuH;
    ctxMenu.classList.add('flip-y');
  }

  ctxMenu.style.left = finalX + 'px';
  ctxMenu.style.top  = finalY + 'px';

  requestAnimationFrame(() => {
    ctxMenu.classList.add('visible');
    ctxVisible = true;
  });
}

function hideCtxMenu() {
  ctxMenu.classList.remove('visible');
  ctxVisible = false;
  // Restart inactivity timer — auto-scroll will resume after 5s
  resetInactivityTimer();
}

// Block default, show custom
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showCtxMenu(e.clientX, e.clientY);
});

// Dismiss on outside click or scroll
document.addEventListener('click', (e) => {
  if (ctxVisible && !ctxMenu.contains(e.target)) hideCtxMenu();
});
document.addEventListener('scroll', () => { if (ctxVisible) hideCtxMenu(); }, { passive: true });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideCtxMenu(); });

// Handle menu item actions
ctxMenu.querySelectorAll('.ctx-item').forEach(btn => {
  btn.addEventListener('click', async () => {
    const action = btn.dataset.action;
    hideCtxMenu();

    switch (action) {

      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      case 'theme':
        cycleTheme();
        break;

      case 'copy': {
        const labelEl = btn.querySelector('.ctx-label');
        const iconEl  = btn.querySelector('.ctx-icon');
        const origLabel = labelEl.textContent;
        const origIcon  = iconEl.textContent;

        function flashCopied() {
          btn.classList.add('copied');
          labelEl.textContent = 'Copied!';
          iconEl.textContent  = '✓';
          setTimeout(() => {
            btn.classList.remove('copied');
            labelEl.textContent = origLabel;
            iconEl.textContent  = origIcon;
          }, 1800);
        }

        const url = window.location.href;

        if (navigator.clipboard && window.isSecureContext) {
          // HTTPS / localhost with secure context
          navigator.clipboard.writeText(url).then(flashCopied).catch(() => {
            fallbackCopy(url);
            flashCopied();
          });
        } else {
          // HTTP fallback (plain localhost, file://, etc.)
          fallbackCopy(url);
          flashCopied();
        }
        break;
      }

      case 'github':
        runSocialTerminal(socialScripts.github);
        break;

      case 'linkedin':
        runSocialTerminal(socialScripts.linkedin);
        break;

      case 'email':
        runSocialTerminal(socialScripts.email);
        break;

      case 'source': {
        // Fetch the raw HTML and display it in a styled new tab
        // (window.open('view-source:...') is blocked by Chrome 87+)
        const html = document.documentElement.outerHTML;
        const escaped = html
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

        const sourceTab = window.open('', '_blank');
        if (sourceTab) {
          sourceTab.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Source — rahulbaberwal.com</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #0d1117;
      color: #c9d1d9;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.7;
      padding: 2rem;
    }
    pre { white-space: pre-wrap; word-break: break-all; }
    .tag   { color: #7ee787; }
    .attr  { color: #79c0ff; }
    .val   { color: #a5d6ff; }
    .cmt   { color: #8b949e; font-style: italic; }
    h1 {
      font-family: sans-serif;
      font-size: 0.75rem;
      color: #58a6ff;
      margin-bottom: 1.5rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <h1>📄 Page Source · rahulbaberwal.com</h1>
  <pre>${escaped}</pre>
</body>
</html>`);
          sourceTab.document.close();
        }
        break;
      }
    }
  });
});

// ─── Mobile Hamburger Menu ─────────────────────────────────────────────────────

const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

function openMobileMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  // Stop auto-scroll while menu is open
  stopAutoScroll();
  clearTimeout(inactivityTimer);
}

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  resetInactivityTimer();
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
});

// Close when a mobile nav link is clicked (terminal takes over from here)
mobileMenu.querySelectorAll('.mobile-links a').forEach(a => {
  a.addEventListener('click', () => closeMobileMenu());
});

// Close on tap outside
document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('open') &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});
