'use client';

import React, { useState, useMemo } from 'react';
import { Project } from '../lib/types';
import ProjectCard from './ProjectCard';

interface ProjectsClientListProps {
  projects: Project[];
}

export default function ProjectsClientList({ projects }: ProjectsClientListProps) {
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Extract all unique tags across all projects
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach((p) => {
      p.tech_stack.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [projects]);

  // Filter projects by active tag selection
  const filteredProjects = useMemo(() => {
    if (!selectedTag) return projects;
    return projects.filter((p) => p.tech_stack.includes(selectedTag));
  }, [projects, selectedTag]);

  return (
    <div>
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 select-none justify-center">
          <button
            onClick={() => setSelectedTag('')}
            className={`skill-tag font-mono text-xs px-3 py-1 rounded transition-colors ${
              selectedTag === ''
                ? 'border-[var(--accent)] text-[var(--accent)] bg-[rgba(108,99,255,0.08)]'
                : ''
            }`}
          >
            All
          </button>
          {allTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTag(tag)}
              className={`skill-tag font-mono text-xs px-3 py-1 rounded transition-colors ${
                selectedTag === tag
                  ? 'border-[var(--accent)] text-[var(--accent)] bg-[rgba(108,99,255,0.08)]'
                  : ''
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid of projects */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center font-mono py-16 text-[var(--text3)] text-base">
          &gt; no projects found matching [{selectedTag}]
        </div>
      )}
    </div>
  );
}
