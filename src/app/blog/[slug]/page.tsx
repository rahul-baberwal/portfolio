import React from 'react';
import { getPosts, getPostBySlug } from '../../../lib/supabase';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Link from 'next/link';
import BlogPostClient from '../../../components/BlogPostClient';
import CodeBlockHelper from '../../../components/CodeBlockHelper';
import { Metadata } from 'next';
import Breadcrumbs from '../../../components/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Set dynamic SEO tags for each blog post
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Rahul Baberwal Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      url: `https://rahulbaberwal.com/blog/${post.slug}`,
      images: [
        {
          url: `https://rahulbaberwal.com/blog/${post.slug}-cover.png`,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`https://rahulbaberwal.com/blog/${post.slug}-cover.png`],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Parse markdown to HTML on the server
  const htmlContent = await Promise.resolve(marked.parse(post.body));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": `https://rahulbaberwal.com/blog/${post.slug}-cover.png`,
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
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
      <BlogPostClient title={post.title} excerpt={post.description}>
        <article className="article-container">
          <header className="article-header">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
            </div>

            {/* Back link */}
            <Link href="/blog" className="article-back-link select-none">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 inline mr-2 align-middle"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to all posts
            </Link>

            {/* Meta */}
            <div className="article-meta select-none">
              <span className="date">
                <i className="fa-regular fa-calendar mr-1"></i> {formatDate(post.published_at)}
              </span>
              <span>·</span>
              <span className="read-time">
                <i className="fa-regular fa-clock mr-1"></i> {post.read_time || '5 min read'}
              </span>
              <span>·</span>
              <span className="author">
                <i className="fa-regular fa-user mr-1"></i> By Rahul Baberwal
              </span>
            </div>

            {/* Title */}
            <h1 className="article-title font-mono font-bold leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="article-tags select-none">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Cover image placeholder */}
          <div className="article-cover-container shadow-lg select-none">
            <img
              src={post.slug === 'django-celery-redis' ? '/blog/django-celery-redis-cover.png' : post.slug === 'disposable-email-filter' ? '/blog/disposable-email-filter-cover.png' : '/blog/custom-auth-vs-jwt-cover.png'}
              alt={post.title}
            />
          </div>

          {/* Body content */}
          <section className="article-content prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </section>

          {/* Author Footer Card */}
          <div className="mt-12 p-8 border border-[var(--border)] rounded-2xl bg-[var(--bg2)] text-center select-none">
            <h3 className="font-mono font-bold text-lg text-[var(--text)] mb-2">About the Author</h3>
            <p className="text-sm leading-relaxed text-[var(--text2)] max-w-xl mx-auto mb-6">
              Rahul Baberwal is a Python Backend Developer at Groww Per Click, currently pursuing an
              MSc in Computer Science and an AI Major from IIT Ropar. He specializes in designing
              scalable server-side systems, machine learning deployments, and complex background
              pipelines.
            </p>
            <Link href="/#contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>
        </article>
      </BlogPostClient>
    </section>
  );
}
