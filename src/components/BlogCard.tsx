'use client';

import React from 'react';
import { Post } from '../lib/types';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <a
      href={`/blog/${post.slug}`}
      className="blog-card select-none"
    >
      <div className="blog-card-image">
        {/* Fallback pattern to base64 placeholder if image fails */}
        <img
          src={post.slug === 'django-celery-redis' ? '/blog/django-celery-redis-cover.png' : post.slug === 'disposable-email-filter' ? '/blog/disposable-email-filter-cover.png' : '/blog/custom-auth-vs-jwt-cover.png'}
          alt={`${post.title} banner`}
          width={800}
          height={450}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzExMTExOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmM2M2ZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9ImJvbGQiPkJsb2cgQXJ0aWNsZTwvdGV4dD48L3N2Zz4=';
          }}
        />
      </div>
      <div className="blog-card-meta">
        <span className="date">{formatDate(post.published_at)}</span>
        <span>·</span>
        <span>{post.read_time || '5 min read'}</span>
      </div>
      <h2 className="blog-card-title">{post.title}</h2>
      <p className="blog-card-excerpt">{post.description}</p>
      
      <div className="blog-card-tags">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="blog-card-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="blog-card-link">
        Read Article
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 ml-1">
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </div>
    </a>
  );
}
