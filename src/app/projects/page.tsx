import React from 'react';
import { getProjects } from '../../lib/supabase';
import ProjectsClientList from '../../components/ProjectsClientList';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects | Rahul Baberwal - Python Backend & AI Engineer',
  description: 'View the engineering projects built by Rahul Baberwal, featuring Python backends, machine learning recommenders, and hyperlocal APIs.',
};

import Breadcrumbs from '../../components/Breadcrumbs';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="pt-28 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8">
        <Breadcrumbs items={[{ label: 'Projects' }]} />
      </div>

      <header className="mb-12 text-center select-none">
        <div className="section-label justify-center">&gt; /projects</div>
        <h1 className="section-title">Case Studies & Projects</h1>
        <p className="font-mono text-sm text-[var(--text2)] mt-2">
          {"// "}{projects.length} project{projects.length !== 1 ? 's' : ''} compiled successfully
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8">
        <ProjectsClientList projects={projects} />
      </main>
    </section>
  );
}
