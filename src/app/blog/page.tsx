import React from 'react';
import { getPosts } from '../../lib/supabase';
import BlogClientList from '../../components/BlogClientList';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog | Rahul Baberwal - Python Backend & AI Engineer',
  description: 'Deep dives on Python backend development, Django optimization, async Celery queues, ML models, and production DevOps strategies.',
};

import Breadcrumbs from '../../components/Breadcrumbs';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <section className="pt-28 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-10 mb-8">
        <Breadcrumbs items={[{ label: 'Blog' }]} />
      </div>

      <header className="mb-12 text-center select-none">
        <div className="section-label justify-center">&gt; /blog</div>
        <h1 className="section-title">The Engineering Blog</h1>
        <p className="font-mono text-sm text-[var(--text2)] mt-2">
          {"// "}{posts.length} post{posts.length !== 1 ? 's' : ''} compiled successfully
        </p>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-10">
        <BlogClientList posts={posts} />
      </main>
    </section>
  );
}
