import React from 'react';
import TerminalHero from '../components/TerminalHero';
import HomeSkills from '../components/HomeSkills';
import ProjectCard from '../components/ProjectCard';
import ExperienceTimeline from '../components/ExperienceTimeline';
import DoodleAvatar from '../components/DoodleAvatar';
import AuroraBg from '../components/AuroraBg';
import PackagesSection from '../components/PackagesSection';
import { getProjects, getPackages } from '../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch projects (will use Supabase or fallback data automatically)
  const projects = await getProjects();
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);
  const displayProjects = [...featuredProjects, ...regularProjects].slice(0, 3);
  
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
            Building at the
            <br />
            edge of AI & Web
          </h2>
          <p>
            I&apos;m Rahul Baberwal, an MSc Computer Science student at Mohta College, MGSU University
            Bikaner, and a Major in Artificial Intelligence from IIT Ropar. I&apos;m passionate about
            building intelligent computing systems that blend machine learning algorithms with
            robust backend development.
          </p>
          <p>
            Currently working as a Python Backend Developer at Groww Per Click, I specialize in a
            wide range of technologies — from FastAPI and Django to scikit-learn and data
            engineering pipelines. I help organizations make an informed decision by handling
            complex data and processing large amounts of data.
          </p>
          <p>
            Certified in NIELIT O Level (IT Professional) — a government-recognized IT foundation
            certification covering a variety of programming language concepts, software
            development, project management, and computer science fundamentals.
          </p>

        </div>
        <div className="about-visual">
          <DoodleAvatar />
        </div>
        </div>
      </section>

      {/* 3. SKILLS SECTION */}
      <HomeSkills />

      {/* 4. PROJECTS SECTION */}
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

      {/* 4.5. PACKAGES SECTION */}
      {packages.length > 0 && <PackagesSection packages={packages} />}

      {/* 5. EXPERIENCE & TIMELINE SECTION */}
      <section id="experience">
        <div>
          <div className="section-label">Journey</div>
          <h2 className="section-title">Experience &amp; Education</h2>
        </div>

        <ExperienceTimeline />
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact">
        <div className="contact-bg"></div>
        <div className="contact-content text-center max-w-2xl mx-auto">
          <div className="section-label justify-center">Contact</div>
          <h2 className="section-title">
            Let&apos;s build something
            <br />
            intelligent together
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--text2)]">
            Open to internships, collaborations, and full-time roles in data science, AI/ML, or
            backend development. Let&apos;s connect.
          </p>
          <a href="mailto:im@rahulbaberwal.com" className="contact-email select-all inline-block mt-4">
            im@rahulbaberwal.com
          </a>
          
          <div className="contact-socials flex justify-center gap-4 mt-8 flex-wrap">
            <a
              href="https://gitlab.com/rahul-baberwal"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-gitlab"></i>
              GitLab
            </a>
            <a
              href="https://github.com/rahul-baberwal"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-github"></i>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/rahul-baberwal/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-linkedin"></i>
              LinkedIn
            </a>
            <a
              href="https://www.facebook.com/rahulbaberwal.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-facebook"></i>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/rahulbaberwal.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link flex items-center gap-2"
            >
              <i className="fa-brands fa-instagram"></i>
              Instagram
            </a>
            <a
              href="https://about.me/rahulbaberwal/"
              target="_blank"
              rel="noopener noreferrer"
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
