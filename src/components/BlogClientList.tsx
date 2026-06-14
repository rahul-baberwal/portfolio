'use client';

import React, { useState, useMemo } from 'react';
import { Post } from '../lib/types';
import BlogCard from './BlogCard';

interface BlogClientListProps {
  posts: Post[];
}

export default function BlogClientList({ posts }: BlogClientListProps) {
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Extract all unique tags across all posts
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((p) => {
      p.tags.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [posts]);

  // Filter posts by active tag selection
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((p) => p.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  return (
    <div>
      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 select-none justify-center">
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

      {/* Grid of posts */}
      {filteredPosts.length > 0 ? (
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center font-mono py-16 text-[var(--text3)] text-base">
          &gt; no posts found matching [{selectedTag}]
        </div>
      )}
    </div>
  );
}
