'use client';

import React from 'react';
import { Project } from '../lib/types';
import { useTerminal } from '../context/TerminalContext';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { triggerTerminalNav } = useTerminal();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Run terminal logs before redirecting
    triggerTerminalNav(`project-${project.slug}`).then(() => {
      // In a real app we redirect to detail page or open github URL
      if (project.github_url && !project.github_url.startsWith('https://github.com/rahul-baberwal/')) {
        window.open(project.github_url, '_blank', 'noopener,noreferrer');
      } else {
        // Redirect to dynamic detail page
        window.location.href = `/projects/${project.slug}`;
      }
    });
  };

  const padNum = (num: number) => String(num).padStart(2, '0');

  return (
    <a
      href={`/projects/${project.slug}`}
      onClick={handleCardClick}
      className="project-card select-none"
    >
      <div className="project-number">
        {padNum(index + 1)} {project.featured && '/ Featured'}
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.tagline}</p>
      
      <div className="project-tech">
        {project.tech_stack.map((tech, idx) => (
          <span key={idx} className="tech-badge">
            {tech}
          </span>
        ))}
      </div>

      <div className="project-link">
        Case Study
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1">
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
    </a>
  );
}
