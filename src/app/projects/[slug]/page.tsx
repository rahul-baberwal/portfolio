import React from 'react';
import { getProjects, getProjectBySlug } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Link from 'next/link';
import { Metadata } from 'next';
import CodeBlockHelper from '../../../components/CodeBlockHelper';
import Breadcrumbs from '../../../components/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic SEO metadata per project
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} | Rahul Baberwal Case Study`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} | Rahul Baberwal`,
      description: project.tagline,
      type: 'article',
      url: `https://rahulbaberwal.com/projects/${project.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Rahul Baberwal`,
      description: project.tagline,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
  if (!project) {
    notFound();
  }

  // Parse markdown content on the server side
  const parsedDescription = await Promise.resolve(marked.parse(project.description));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.tagline,
    "applicationCategory": "DeveloperApplication",
    "url": `https://rahulbaberwal.com/projects/${project.slug}`,
    "author": {
      "@id": "https://rahulbaberwal.com/#person"
    }
  };

  return (
    <section className="pt-28 pb-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CodeBlockHelper />
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: project.title }]} />
        </div>

        {/* Back Link */}
        <Link href="/projects" className="article-back-link mb-8 inline-flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-4 h-4"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to all projects
        </Link>

        {/* Hero Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech_stack.map((tech, idx) => (
              <span key={idx} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-mono mb-4 text-[var(--text)]">
            {project.title}
          </h1>
          <p className="text-lg text-[var(--text2)] leading-relaxed">{project.tagline}</p>
        </header>

        {/* Project Links Panel */}
        <div className="flex gap-4 mb-8">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <i className="fa-brands fa-github text-[16px]"></i>
              Codebase
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[16px]"></i>
              Live Demo
            </a>
          )}
        </div>

        {/* Cover image placeholder / container */}
        {project.cover_image && (
          <div className="article-cover-container mb-12 shadow-lg select-none">
            <img src={project.cover_image} alt={`${project.title} cover banner`} width={800} height={450} />
          </div>
        )}

        {/* Dynamic Case Study Markdown Content */}
        <article className="article-content prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: parsedDescription }} />
        </article>
      </div>
    </section>
  );
}
