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
    if (project.no_link) return;
    e.preventDefault();
    // Run terminal logs before redirecting
    triggerTerminalNav(`project-${project.slug}`).then(() => {
      if (project.live_url) {
        window.open(project.live_url, '_blank', 'noopener,noreferrer');
      } else {
        // Redirect to dynamic detail page
        window.location.href = `/projects/${project.slug}`;
      }
    });
  };

  const padNum = (num: number) => String(num).padStart(2, '0');

  const cardInner = (
    <>
      <div className="project-number">
        {padNum(index + 1)} {project.featured && '/ Featured'}{' '}
        {project.label && `· ${project.label}`}
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

      {!project.no_link && (
        <div className="project-link">
          {project.live_url ? 'Visit Site' : 'Case Study'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
      )}
    </>
  );

  if (project.no_link) {
    return (
      <div className="project-card select-none">
        {cardInner}
      </div>
    );
  }

  return (
    <a
      href={project.live_url || `/projects/${project.slug}`}
      onClick={handleCardClick}
      className="project-card select-none"
    >
      {cardInner}
    </a>
  );
}
