import React from 'react';
import TerminalHero from '../components/TerminalHero';
import HomeSkills from '../components/HomeSkills';
import ProjectCard from '../components/ProjectCard';
import ExperienceTimeline from '../components/ExperienceTimeline';
import DoodleAvatar from '../components/DoodleAvatar';
import AuroraBg from '../components/AuroraBg';
import PackagesSection from '../components/PackagesSection';
import AppsSection from '../components/AppsSection';
import ToolsSection from '../components/ToolsSection';
import { getProjects, getPackages } from '../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch projects (will use Supabase or fallback data automatically)
  const displayProjects = await getProjects();
  
  // Fetch open source packages
  const packages = await getPackages();

  return (
    <>
      {/* Global unique background */}
      <AuroraBg />

      {/* 1. HERO SECTION */}
      <TerminalHero />

      {/* 2. ABOUT SECTION */}
      <section id="about">
        <div className="max-w-6xl mx-auto w-full about-inner">
        <div className="about-text">
          <div className="section-label">About me</div>
          <h2 className="section-title">
            Android, Python &amp;
            <br />
            Open-source
          </h2>
          <p>
            I&apos;m Rahul Baberwal, a full-stack developer building SaaS platforms, REST APIs and
            internal tools, alongside native Android apps (Kotlin, Jetpack Compose) and Python
            backends (Django, DRF, FastAPI).
          </p>
          <p>
            Proof of work: 3 published Android apps across multiple stores, 3 open-source Django
            packages on PyPI (django-dynamic-qr, django-var-cms, django-meta-whatsapp),
            browser-based web tools used by developers and exam aspirants (IndexPilot, Patra,
            Tankan), and a current role as Software Developer at AdsToPlay (Jul 2026 – Present),
            following Full Stack Developer work at Groww Per Click. My AI Major at IIT Ropar
            informs how I approach data-heavy problems.
          </p>
          <p>
            Open to software, Android, and backend roles, as well as open-source collaborations.
            Reach me at{' '}
            <a href="mailto:im@rahulbaberwal.com" className="underline">
              im@rahulbaberwal.com
            </a>
            .
          </p>

        </div>
        <div className="about-visual">
          <DoodleAvatar />
        </div>
        </div>
      </section>

      {/* 3. APPS I'VE SHIPPED SECTION */}
      <AppsSection />

      {/* 4. TOOLS I'VE BUILT SECTION */}
      <ToolsSection />

      {/* 5. PACKAGES SECTION */}
      {packages.length > 0 && <PackagesSection packages={packages} />}

      {/* 5. PROJECTS SECTION */}
      <section id="projects">
        <div className="max-w-6xl mx-auto w-full">
        <div>
          <div className="section-label">Work</div>
          <h2 className="section-title">Featured Projects</h2>
        </div>

        <div className="projects-grid">
          {displayProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
        </div>
      </section>

      {/* 6. SKILLS SECTION */}
      <HomeSkills />

      {/* 7. EXPERIENCE & TIMELINE SECTION */}
      <section id="experience">
        <div>
          <div className="section-label">Journey</div>
          <h2 className="section-title">Experience &amp; Education</h2>
        </div>

        <ExperienceTimeline />
      </section>

      {/* 8. CONTACT SECTION */}
      <section id="contact">
        <div className="contact-bg"></div>
        <div className="contact-content text-center max-w-2xl mx-auto">
          <div className="section-label justify-center">Contact</div>
          <h2 className="section-title">
            Let&apos;s build something
            <br />
            great together
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--text2)]">
            Open to software, Android and backend roles, plus collaborations.
          </p>
          <a href="mailto:im@rahulbaberwal.com" className="contact-email select-all inline-block mt-4">
            im@rahulbaberwal.com
          </a>
          
          <div className="contact-socials flex justify-center gap-4 mt-8 flex-wrap">
            <a
              href="https://gitlab.com/rahul-baberwal"
              target="_blank"
              rel="me noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-gitlab"></i>
              GitLab
            </a>
            <a
              href="https://github.com/rahul-baberwal"
              target="_blank"
              rel="me noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-github"></i>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-baberwal/"
              target="_blank"
              rel="me noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-linkedin"></i>
              LinkedIn
            </a>
            <a
              href="https://www.facebook.com/rahulbaberwal.in/"
              target="_blank"
              rel="me noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-facebook"></i>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/rahulbaberwal.in/"
              target="_blank"
              rel="me noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-instagram"></i>
              Instagram
            </a>
            <a
              href="https://about.me/rahulbaberwal/"
              target="_blank"
              rel="me noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-solid fa-circle-user"></i>
              About.me
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
