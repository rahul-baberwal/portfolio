'use client';

import React, { useEffect, useRef, useState } from 'react';
import { staticSkills } from '../lib/static-data';

import {
  JavascriptIcon,
  PythonIcon,
  DjangoIcon,
  DjangoRestIcon,
  FastAPIIcon,
  DockerIcon,
  PostgreSQLIcon,
  RedisIcon
} from './TechIcons';

interface SkillBarItem {
  name: string;
  icon: string;
  level: string; // e.g. "80%"
}

const mainSkills: SkillBarItem[] = [
  { name: 'JavaScript', icon: 'devicon-javascript-plain', level: '80%' },
  { name: 'Python', icon: 'devicon-python-plain', level: '88%' },
  { name: 'Django', icon: 'devicon-django-plain', level: '78%' },
  { name: 'Django REST', icon: 'devicon-djangorest-plain', level: '72%' },
  { name: 'FastAPI', icon: 'devicon-fastapi-plain', level: '72%' },
  { name: 'Docker', icon: 'devicon-docker-plain', level: '65%' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', level: '70%' },
  { name: 'Redis', icon: 'devicon-redis-plain', level: '65%' },
  { name: 'Celery', icon: 'fa-solid fa-bolt', level: '65%' },
  { name: 'Machine Learning', icon: 'fa-solid fa-gears', level: '70%' },
];

function getSkillIcon(iconName: string) {
  switch (iconName) {
    case 'devicon-javascript-plain':
      return <JavascriptIcon size={24} />;
    case 'devicon-python-plain':
      return <PythonIcon size={24} />;
    case 'devicon-django-plain':
      return <DjangoIcon size={24} />;
    case 'devicon-djangorest-plain':
      return <DjangoRestIcon size={24} />;
    case 'devicon-fastapi-plain':
      return <FastAPIIcon size={24} />;
    case 'devicon-docker-plain':
      return <DockerIcon size={24} />;
    case 'devicon-postgresql-plain':
      return <PostgreSQLIcon size={24} />;
    case 'devicon-redis-plain':
      return <RedisIcon size={24} />;
    default:
      return <i className={iconName}></i>;
  }
}

export default function HomeSkills() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [animateBars, setAnimateBars] = useState<boolean>(false);

  // Skill bars fill animation using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateBars(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Card cursor light glow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  };

  return (
    <section id="skills">
      <div className="max-w-6xl mx-auto w-full">
        <div>
        <div className="section-label">Skills & Stack</div>
        <h2 className="section-title">Technologies I work with</h2>
      </div>

      {/* Interactive Main Skill Cards */}
      <div className="skills-grid" ref={gridRef}>
        {mainSkills.map((skill, idx) => (
          <div
            key={idx}
            className="skill-card select-none"
            onMouseMove={handleMouseMove}
          >
            <div className="skill-icon text-white">
              {getSkillIcon(skill.icon)}
            </div>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-bar-container">
              <div
                className="skill-bar"
                style={{ width: animateBars ? skill.level : '0%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-Skill Categories Tag Clouds */}
      <div className="skills-categories mt-12">
        {staticSkills.map((cat, idx) => (
          <div key={idx} className="skill-category">
            <h3 className="category-title flex items-center gap-2">
              <i className={cat.icon}></i> {cat.title}
            </h3>
            <div className="skill-tags">
              {cat.tags.map((tag, tagIdx) => (
                <span key={tagIdx} className="skill-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
