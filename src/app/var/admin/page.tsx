'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase, getPosts, getProjects, getPackages, upsertPost, deletePost, upsertProject, deleteProject, upsertPackage, deletePackage } from '../../../lib/supabase';
import { Post, Project, Package } from '../../../lib/types';
import { marked } from 'marked';

export default function AdminCMS() {
  // Authentication & System states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'blogs' | 'projects' | 'packages'>('blogs');
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Listings data
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  // Blog Editor State
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [blogTagsInput, setBlogTagsInput] = useState('');
  const [editorMode, setEditorMode] = useState<'markdown' | 'visual-html'>('markdown');
  const [dragActive, setDragActive] = useState(false);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectTechInput, setProjectTechInput] = useState('');

  // Package Editor State
  const [editingPackage, setEditingPackage] = useState<Partial<Package> | null>(null);

  // Refs for editor textarea selection insertion
  const blogBodyRef = useRef<HTMLTextAreaElement>(null);
  const projectBodyRef = useRef<HTMLTextAreaElement>(null);

  // Check active Supabase session on load
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  // Fetch data if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkConnectionAndLoad();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!supabase) {
      setAuthError('Supabase client is not initialized.');
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      if (data?.session) {
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const checkConnectionAndLoad = async () => {
    setDbStatus('checking');
    setDbError(null);
    try {
      if (!supabase) {
        throw new Error('Supabase URL or Anon Key is missing. Check your env files.');
      }
      
      // Attempt fetching from Supabase directly to test connection
      const { error: postError } = await supabase.from('posts').select('id').limit(1);
      if (postError) {
        throw new Error(`Connection test failed: ${postError.message}. Make sure posts and projects tables are created.`);
      }

      // Load data
      const fetchedPosts = await getPosts();
      const fetchedProjects = await getProjects();
      const fetchedPackages = await getPackages();
      
      setPosts(fetchedPosts);
      setProjects(fetchedProjects);
      setPackages(fetchedPackages);
      setDbStatus('connected');
    } catch (err: any) {
      console.error(err);
      setDbStatus('disconnected');
      setDbError(err.message || 'Unknown database connection error.');
    }
  };

  /* ─────────────────────────────────────────────
     BLOG POST ACTIONS & HANDLERS
     ───────────────────────────────────────────── */
  const startNewPost = () => {
    setEditingPost({
      title: '',
      slug: '',
      description: '',
      body: '',
      tags: [],
      published: true,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      read_time: '5 min read'
    });
    setBlogTagsInput('');
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setBlogTagsInput(post.tags.join(', '));
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setIsLoading(true);
    try {
      const formattedPost = {
        ...editingPost,
        tags: blogTagsInput.split(',').map(t => t.trim()).filter(Boolean),
        updated_at: new Date().toISOString()
      };
      
      await upsertPost(formattedPost);
      setEditingPost(null);
      await checkConnectionAndLoad();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and Drop markdown handler
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseMarkdownFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      parseMarkdownFile(e.target.files[0]);
    }
  };

  const parseMarkdownFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Extract front matter if present
      // Match structure --- \n key: val \n --- \n body
      const frontMatterMatch = text.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
      
      let title = file.name.replace(/\.md$/, '').replace(/-/g, ' ');
      let slug = file.name.replace(/\.md$/, '').toLowerCase();
      let description = '';
      let tags: string[] = [];
      let readTime = '5 min read';
      let body = text;

      if (frontMatterMatch) {
        const metadataBlock = frontMatterMatch[1];
        body = frontMatterMatch[2];

        // Parse yaml metadata lines
        metadataBlock.split('\n').forEach((line) => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            const key = line.substring(0, colonIdx).trim().toLowerCase();
            let val = line.substring(colonIdx + 1).trim();
            // strip surrounding quotes
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
            }

            if (key === 'title') title = val;
            else if (key === 'slug') slug = val.toLowerCase();
            else if (key === 'description') description = val;
            else if (key === 'read_time') readTime = val;
            else if (key === 'tags') {
              // try to parse brackets list like [A, B] or clean comma-separated list
              tags = val.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean);
            }
          }
        });
      } else {
        // Fallback: search for first h1 or h2 as title
        const titleMatch = text.match(/^(?:#|##)\s+(.+)$/m);
        if (titleMatch) {
          title = titleMatch[1];
        }
        // first non-header block as description
        const paragraphs = text.split('\n').map(p => p.trim()).filter(p => p && !p.startsWith('#'));
        if (paragraphs.length > 0) {
          description = paragraphs[0].substring(0, 160) + (paragraphs[0].length > 160 ? '...' : '');
        }
      }

      setEditingPost(prev => ({
        ...prev,
        title,
        slug,
        description,
        body,
        read_time: readTime
      }));
      setBlogTagsInput(tags.join(', '));
    };
    reader.readAsText(file);
  };

  // Visual text toolbar insertions
  const insertTag = (tagType: 'h2' | 'bold' | 'italic' | 'link' | 'code' | 'ul') => {
    const txtArea = blogBodyRef.current;
    if (!txtArea || !editingPost) return;

    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    const currentText = editingPost.body || '';
    const selected = currentText.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    if (editorMode === 'markdown') {
      if (tagType === 'h2') {
        replacement = `\n## ${selected || 'Heading 2'}\n`;
      } else if (tagType === 'bold') {
        replacement = `**${selected || 'bold text'}**`;
      } else if (tagType === 'italic') {
        replacement = `*${selected || 'italic text'}*`;
      } else if (tagType === 'link') {
        replacement = `[${selected || 'Link Text'}](https://example.com)`;
      } else if (tagType === 'code') {
        replacement = `\n\`\`\`python\n${selected || '# code snippet'}\n\`\`\`\n`;
      } else if (tagType === 'ul') {
        replacement = `\n- ${selected || 'list item'}\n`;
      }
    } else {
      // HTML editor mode
      if (tagType === 'h2') {
        replacement = `<h2>${selected || 'Heading 2'}</h2>`;
      } else if (tagType === 'bold') {
        replacement = `<strong>${selected || 'bold text'}</strong>`;
      } else if (tagType === 'italic') {
        replacement = `<em>${selected || 'italic text'}</em>`;
      } else if (tagType === 'link') {
        replacement = `<a href="https://example.com">${selected || 'Link Text'}</a>`;
      } else if (tagType === 'code') {
        replacement = `<pre><code>\n${selected || '# python code'}\n</code></pre>`;
      } else if (tagType === 'ul') {
        replacement = `<ul>\n  <li>${selected || 'list item'}</li>\n</ul>`;
      }
    }

    const newBody = currentText.substring(0, start) + replacement + currentText.substring(end);
    setEditingPost({ ...editingPost, body: newBody });
    
    // Reset focus & selection
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  /* ─────────────────────────────────────────────
     PROJECT ACTIONS & HANDLERS
     ───────────────────────────────────────────── */
  const startNewProject = () => {
    setEditingProject({
      title: '',
      slug: '',
      tagline: '',
      description: '',
      tech_stack: [],
      github_url: '',
      live_url: '',
      cover_image: '',
      featured: false,
      sort_order: 0
    });
    setProjectTechInput('');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectTechInput(project.tech_stack.join(', '));
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsLoading(true);
    try {
      const formattedProject = {
        ...editingProject,
        tech_stack: projectTechInput.split(',').map(t => t.trim()).filter(Boolean)
      };
      
      await upsertProject(formattedProject);
      setEditingProject(null);
      await checkConnectionAndLoad();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Visual Project toolbar insertions
  const insertProjectTag = (tagType: 'h2' | 'bold' | 'italic' | 'link' | 'code' | 'ul') => {
    const txtArea = projectBodyRef.current;
    if (!txtArea || !editingProject) return;

    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    const currentText = editingProject.description || '';
    const selected = currentText.substring(start, end);

    let replacement = '';
    if (tagType === 'h2') replacement = `\n## ${selected || 'Heading 2'}\n`;
    else if (tagType === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (tagType === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (tagType === 'link') replacement = `[${selected || 'Link Text'}](https://example.com)`;
    else if (tagType === 'code') replacement = `\n\`\`\`python\n${selected || '# code snippet'}\n\`\`\`\n`;
    else if (tagType === 'ul') replacement = `\n- ${selected || 'list item'}\n`;

    const newDesc = currentText.substring(0, start) + replacement + currentText.substring(end);
    setEditingProject({ ...editingProject, description: newDesc });

    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  /* ─────────────────────────────────────────────
     PACKAGE ACTIONS & HANDLERS
     ───────────────────────────────────────────── */
  const startNewPackage = () => {
    setEditingPackage({
      title: '',
      slug: '',
      description: '',
      docs_url: '',
      github_url: '',
      logo_url: '',
      sort_order: 0,
      publishers: []
    });
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage({ ...pkg });
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await deletePackage(id);
      setPackages(packages.filter(p => p.id !== id));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setIsLoading(true);
    try {
      await upsertPackage(editingPackage);
      setEditingPackage(null);
      await checkConnectionAndLoad();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPublisher = () => {
    if (!editingPackage) return;
    setEditingPackage({
      ...editingPackage,
      publishers: [
        ...(editingPackage.publishers || []),
        { platform_name: '', platform_url: '', icon_class: '' }
      ]
    });
  };

  const handleUpdatePublisher = (index: number, key: string, value: string) => {
    if (!editingPackage || !editingPackage.publishers) return;
    const newPubs = [...editingPackage.publishers];
    newPubs[index] = { ...newPubs[index], [key]: value };
    setEditingPackage({ ...editingPackage, publishers: newPubs });
  };

  const handleRemovePublisher = (index: number) => {
    if (!editingPackage || !editingPackage.publishers) return;
    const newPubs = [...editingPackage.publishers];
    newPubs.splice(index, 1);
    setEditingPackage({ ...editingPackage, publishers: newPubs });
  };

  // Safe markdown render
  const renderPreview = (content: string) => {
    try {
      return { __html: marked.parse(content || '') };
    } catch (e) {
      return { __html: `<p>Preview error: ${e}</p>` };
    }
  };

  /* ─────────────────────────────────────────────
     RENDER GATE SCREEN
     ───────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <section className="admin-lock-screen">
        <div className="lock-card">
          <div className="lock-icon">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h2 className="font-mono text-xl font-bold mb-2 text-[var(--text)]">CMS Access Portal</h2>
          <p className="text-xs text-[var(--text2)] mb-6 select-none">
            Sign in with your Supabase email and passcode to manage portfolio posts and projects.
          </p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                className="form-input text-left font-mono mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="form-input text-left font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {authError && <p className="text-xs text-[#ff5f56] font-mono mb-4">{authError}</p>}
            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────
     RENDER CMS WORKSPACE
     ───────────────────────────────────────────── */
  return (
    <section className="admin-container min-h-screen">
      {/* 1. Header Toolbar */}
      <header className="admin-header select-none">
        <div>
          <div className="admin-subtitle">&gt; rahul-baberwal / portfolio-cms</div>
          <h1 className="admin-title">
            Portals <span>CMS</span> Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {dbStatus === 'connected' ? (
            <span className="status-badge connected">
              <i className="fa-solid fa-circle-check"></i> Supabase Connected
            </span>
          ) : dbStatus === 'checking' ? (
            <span className="status-badge font-mono text-[var(--text3)]">
              <i className="fa-solid fa-spinner animate-spin"></i> Checking Database...
            </span>
          ) : (
            <span className="status-badge disconnected">
              <i className="fa-solid fa-triangle-exclamation"></i> Database Error
            </span>
          )}
          <button onClick={handleLogout} className="btn-outline btn-sm">
            <i className="fa-solid fa-right-from-bracket"></i> Exit
          </button>
        </div>
      </header>

      {/* Database Error Banner & Seeding Option */}
      {dbStatus !== 'connected' && dbError && (
        <div className="admin-card border-[#ff5f56]/30 bg-[#ff5f56]/5 mb-6 text-sm">
          <h3 className="font-bold text-[#ff5f56] mb-2 flex items-center gap-2">
            <i className="fa-solid fa-database"></i> Supabase Setup Warning
          </h3>
          <p className="mb-4 text-[var(--text2)] leading-relaxed">
            {dbError}
          </p>
          <div className="bg-black/40 p-4 rounded-lg font-mono text-xs border border-white/5 mb-4 max-h-56 overflow-y-auto select-all">
            {`-- STEP 1: Run this in the Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::text[],
  published_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  published BOOLEAN DEFAULT true,
  read_time TEXT
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}'::text[],
  github_url TEXT,
  live_url TEXT,
  cover_image TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- STEP 2: Disable RLS so the anon key can do full CRUD
-- (safe for a personal portfolio — you control who knows the URL)
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;`}
          </div>
          <button onClick={checkConnectionAndLoad} className="btn-primary btn-sm flex items-center gap-1">
            <i className="fa-solid fa-arrows-rotate"></i> Retry Connection
          </button>
        </div>
      )}

      {/* Connected diagnostics & actions */}
      {dbStatus === 'connected' && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg3)] border border-[var(--border)] p-4 rounded-xl mb-6">
          <div className="text-xs text-[var(--text2)] font-mono">
            <span>Database: <b>{posts.length}</b> posts · <b>{projects.length}</b> projects · <b>{packages.length}</b> packages</span>
          </div>
          <button onClick={checkConnectionAndLoad} className="btn-outline btn-sm flex items-center gap-1">
            <i className="fa-solid fa-arrows-rotate"></i> Refresh
          </button>
        </div>
      )}

      {/* Main CMS Editor Layout / Listings Toggle */}
      {!editingPost && !editingProject && !editingPackage ? (
        <>
          {/* Tabs header */}
          <div className="admin-tabs select-none">
            <button
              className={`admin-tab ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              &gt; manage_blogs
            </button>
            <button
              className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              &gt; manage_projects
            </button>
            <button
              className={`admin-tab ${activeTab === 'packages' ? 'active' : ''}`}
              onClick={() => setActiveTab('packages')}
            >
              &gt; manage_packages
            </button>
          </div>

          {/* Tab 1: Blogs Listing */}
          {activeTab === 'blogs' && (
            <div className="admin-card">
              <div className="flex justify-between items-center mb-6 select-none">
                <h3 className="font-mono text-base font-bold text-[var(--text)]">Published & Draft Posts</h3>
                <button onClick={startNewPost} className="btn-primary btn-sm flex items-center gap-1">
                  <i className="fa-solid fa-plus"></i> Write Blog
                </button>
              </div>
              
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center font-mono text-xs text-[var(--text3)] py-12">
                          No blog posts found in database. Write a new post or seed data.
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id}>
                          <td className="font-bold">{post.title}</td>
                          <td className="font-mono text-xs text-[var(--text3)]">/blog/{post.slug}</td>
                          <td>
                            {post.tags.map((t, i) => (
                              <span key={i} className="admin-tag-span">{t}</span>
                            ))}
                          </td>
                          <td>
                            {post.published ? (
                              <span className="text-[var(--accent3)] text-xs font-mono">Published</span>
                            ) : (
                              <span className="text-[var(--text3)] text-xs font-mono">Draft</span>
                            )}
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleEditPost(post)} className="btn-outline btn-sm py-1 px-3">
                                <i className="fa-solid fa-pen"></i> Edit
                              </button>
                              <button onClick={() => handleDeletePost(post.id)} className="btn-danger btn-sm py-1 px-3">
                                <i className="fa-solid fa-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Projects Listing */}
          {activeTab === 'projects' && (
            <div className="admin-card">
              <div className="flex justify-between items-center mb-6 select-none">
                <h3 className="font-mono text-base font-bold text-[var(--text)]">Projects & Case Studies</h3>
                <button onClick={startNewProject} className="btn-primary btn-sm flex items-center gap-1">
                  <i className="fa-solid fa-plus"></i> Add Project
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Title</th>
                      <th>Tagline</th>
                      <th>Tech Stack</th>
                      <th>Type</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center font-mono text-xs text-[var(--text3)] py-12">
                          No projects found in database. Add a new project or seed data.
                        </td>
                      </tr>
                    ) : (
                      projects.map((proj) => (
                        <tr key={proj.id}>
                          <td className="font-mono text-xs text-[var(--text3)]">{proj.sort_order}</td>
                          <td className="font-bold">{proj.title}</td>
                          <td className="text-sm max-w-xs truncate">{proj.tagline}</td>
                          <td>
                            {proj.tech_stack.map((t, i) => (
                              <span key={i} className="admin-tag-span">{t}</span>
                            ))}
                          </td>
                          <td>
                            {proj.featured ? (
                              <span className="text-[#febc2e] text-xs font-mono">Featured</span>
                            ) : (
                              <span className="text-[var(--text3)] text-xs font-mono">Regular</span>
                            )}
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleEditProject(proj)} className="btn-outline btn-sm py-1 px-3">
                                <i className="fa-solid fa-pen"></i> Edit
                              </button>
                              <button onClick={() => handleDeleteProject(proj.id)} className="btn-danger btn-sm py-1 px-3">
                                <i className="fa-solid fa-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Packages Listing */}
          {activeTab === 'packages' && (
            <div className="admin-card">
              <div className="flex justify-between items-center mb-6 select-none">
                <h3 className="font-mono text-base font-bold text-[var(--text)]">Open Source Packages</h3>
                <button onClick={startNewPackage} className="btn-primary btn-sm flex items-center gap-1">
                  <i className="fa-solid fa-plus"></i> Add Package
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Package Name</th>
                      <th>Links</th>
                      <th>Publishers</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center font-mono text-xs text-[var(--text3)] py-12">
                          No packages found. Add your PyPI or npm packages here.
                        </td>
                      </tr>
                    ) : (
                      packages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td className="font-mono text-xs text-[var(--text3)]">{pkg.sort_order}</td>
                          <td className="font-bold">{pkg.title}<br/><span className="font-mono text-[10px] text-[var(--text3)]">{pkg.slug}</span></td>
                          <td>
                            <div className="flex gap-2 text-[var(--text3)]">
                              {pkg.github_url && <a href={pkg.github_url} target="_blank" rel="noreferrer" title="GitHub"><i className="fa-brands fa-github"></i></a>}
                              {pkg.docs_url && <a href={pkg.docs_url} target="_blank" rel="noreferrer" title="Docs"><i className="fa-solid fa-book"></i></a>}
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {pkg.publishers?.map((pub, i) => (
                                <span key={i} className="admin-tag-span text-[10px]"><i className={pub.icon_class || 'fa-solid fa-box'}></i> {pub.platform_name}</span>
                              ))}
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleEditPackage(pkg)} className="btn-outline btn-sm py-1 px-3">
                                <i className="fa-solid fa-pen"></i> Edit
                              </button>
                              <button onClick={() => handleDeletePackage(pkg.id)} className="btn-danger btn-sm py-1 px-3">
                                <i className="fa-solid fa-trash"></i> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : editingPost ? (
        /* ─────────────────────────────────────────────
           BLOG EDIT SCREEN
           ───────────────────────────────────────────── */
        <div className="admin-card">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)] select-none">
            <h2 className="font-mono text-lg font-bold text-[var(--text)]">
              {editingPost.id ? 'Edit Blog Post' : 'New Blog Post'}
            </h2>
            <button onClick={() => setEditingPost(null)} className="btn-outline btn-sm">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSavePost}>
            {/* MD File Uploader Zone */}
            <div className="form-group">
              <label className="form-label select-none">Markdown Import Uploader (.md)</label>
              <div 
                className={`upload-zone ${dragActive ? 'dragging' : ''}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('md-uploader-input')?.click()}
              >
                <input 
                  type="file" 
                  id="md-uploader-input" 
                  accept=".md" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <div className="upload-icon"><i className="fa-regular fa-file-code"></i></div>
                <p className="text-sm text-[var(--text)] font-semibold select-none">
                  Drag & drop a markdown file here, or click to upload
                </p>
                <p className="text-xs text-[var(--text3)] mt-1 font-mono select-none">
                  (Supports YAML front-matter: title, slug, tags, description, read_time)
                </p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Post title"
                  className="form-input"
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="post-slug-format"
                  className="form-input font-mono"
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Django, Python, Backend"
                  className="form-input font-mono"
                  value={blogTagsInput}
                  onChange={(e) => setBlogTagsInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Read Time</label>
                <input
                  type="text"
                  placeholder="8 min read"
                  className="form-input"
                  value={editingPost.read_time || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, read_time: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Excerpt Description</label>
              <textarea
                required
                placeholder="A brief compelling overview for card listings..."
                className="form-input"
                style={{ height: '70px' }}
                value={editingPost.description || ''}
                onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
              />
            </div>

            {/* Visual HTML toolbar & Text Area */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1 select-none">
                <label className="form-label">Blog Post Body (HTML / Markdown)</label>
                <div className="flex gap-2 text-xs font-mono">
                  <button 
                    type="button" 
                    className={`px-2 py-0.5 rounded border border-[var(--border)] ${editorMode === 'markdown' ? 'bg-[var(--accent)] text-white' : ''}`}
                    onClick={() => setEditorMode('markdown')}
                  >
                    Markdown Mode
                  </button>
                  <button 
                    type="button" 
                    className={`px-2 py-0.5 rounded border border-[var(--border)] ${editorMode === 'visual-html' ? 'bg-[var(--accent)] text-white' : ''}`}
                    onClick={() => setEditorMode('visual-html')}
                  >
                    HTML Mode
                  </button>
                </div>
              </div>

              {/* Text formatting toolbar */}
              <div className="editor-toolbar">
                <button type="button" onClick={() => insertTag('h2')} className="toolbar-btn" title="Add Heading 2">
                  <i className="fa-solid fa-heading"></i> H2
                </button>
                <button type="button" onClick={() => insertTag('bold')} className="toolbar-btn" title="Bold Selection">
                  <i className="fa-solid fa-bold"></i> B
                </button>
                <button type="button" onClick={() => insertTag('italic')} className="toolbar-btn" title="Italic Selection">
                  <i className="fa-solid fa-italic"></i> I
                </button>
                <button type="button" onClick={() => insertTag('link')} className="toolbar-btn" title="Insert Anchor Link">
                  <i className="fa-solid fa-link"></i> Link
                </button>
                <button type="button" onClick={() => insertTag('code')} className="toolbar-btn" title="Insert Code Block">
                  <i className="fa-solid fa-code"></i> Code
                </button>
                <button type="button" onClick={() => insertTag('ul')} className="toolbar-btn" title="Add Unordered List">
                  <i className="fa-solid fa-list-ul"></i> List
                </button>
              </div>

              <textarea
                ref={blogBodyRef}
                required
                placeholder={editorMode === 'markdown' ? '# Heading 1\nType markdown body content...' : '<h2>Heading</h2>\n<p>Type HTML content...</p>'}
                className="form-input form-textarea toolbar-editor-textarea font-mono"
                value={editingPost.body || ''}
                onChange={(e) => setEditingPost({ ...editingPost, body: e.target.value })}
              />
            </div>

            {/* Checkboxes & Dates */}
            <div className="form-row mb-6">
              <div className="form-group flex items-center">
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={editingPost.published || false}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                  />
                  <span>Publish immediately (visible in listing)</span>
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Published At Date</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="YYYY-MM-DDTHH:MM:SSZ"
                  value={editingPost.published_at || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, published_at: e.target.value })}
                />
              </div>
            </div>

            {/* Side-by-Side Dynamic Render HTML Preview */}
            <div className="editor-preview-container">
              <div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
                  <i className="fa-solid fa-cloud-arrow-up"></i> {isLoading ? 'Saving...' : 'Save Post to Supabase'}
                </button>
              </div>
              <div className="preview-panel">
                <div className="preview-header">
                  <span><i className="fa-regular fa-eye"></i> Rendered Live Preview</span>
                  <span className="font-mono text-xs">{editorMode === 'markdown' ? 'Markdown Parsed' : 'HTML Native'}</span>
                </div>
                <article className="article-content select-text prose prose-invert">
                  <h1 className="article-title">{editingPost.title || 'Post Title'}</h1>
                  <div className="article-meta select-none">
                    <span className="date"><i className="fa-regular fa-calendar mr-1"></i> {editingPost.published_at ? new Date(editingPost.published_at).toLocaleDateString() : 'Date'}</span>
                    <span>·</span>
                    <span className="read-time"><i className="fa-regular fa-clock mr-1"></i> {editingPost.read_time || '5 min read'}</span>
                  </div>
                  {/* Parsing markdown inside preview using marked */}
                  <div dangerouslySetInnerHTML={renderPreview(editingPost.body || '')} />
                </article>
              </div>
            </div>
          </form>
        </div>
      ) : editingProject ? (
        /* ─────────────────────────────────────────────
           PROJECT EDIT SCREEN
           ───────────────────────────────────────────── */
        <div className="admin-card">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)] select-none">
            <h2 className="font-mono text-lg font-bold text-[var(--text)]">
              {editingProject.id ? 'Edit Project' : 'New Project'}
            </h2>
            <button onClick={() => setEditingProject(null)} className="btn-outline btn-sm">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveProject}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyperlocal Analytics Engine"
                  className="form-input"
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="project-slug-format"
                  className="form-input font-mono"
                  value={editingProject.slug || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tagline / Brief Subtitle</label>
                <input
                  type="text"
                  required
                  placeholder="A Django-based geo recommender..."
                  className="form-input"
                  value={editingProject.tagline || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="Django, Redis, Docker, PostgreSQL"
                  className="form-input font-mono"
                  value={projectTechInput}
                  onChange={(e) => setProjectTechInput(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">GitHub Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/rahul-baberwal/project"
                  className="form-input font-mono"
                  value={editingProject.github_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://demo.rahulbaberwal.com"
                  className="form-input font-mono"
                  value={editingProject.live_url || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cover Image URL / Base64</label>
                <input
                  type="text"
                  placeholder="/projects/cover.png or data:image/..."
                  className="form-input font-mono"
                  value={editingProject.cover_image || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, cover_image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sort Order (number)</label>
                <input
                  type="number"
                  className="form-input font-mono"
                  value={editingProject.sort_order || 0}
                  onChange={(e) => setEditingProject({ ...editingProject, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                />
                <span>Featured Project (renders on home page featured list)</span>
              </label>
            </div>

            {/* Visual Project toolbar & Text Area */}
            <div className="form-group">
              <label className="form-label">Project Details / Case Study Markdown Description</label>
              
              <div className="editor-toolbar select-none">
                <button type="button" onClick={() => insertProjectTag('h2')} className="toolbar-btn" title="Add Heading 2">
                  <i className="fa-solid fa-heading"></i> H2
                </button>
                <button type="button" onClick={() => insertProjectTag('bold')} className="toolbar-btn" title="Bold Selection">
                  <i className="fa-solid fa-bold"></i> B
                </button>
                <button type="button" onClick={() => insertProjectTag('italic')} className="toolbar-btn" title="Italic Selection">
                  <i className="fa-solid fa-italic"></i> I
                </button>
                <button type="button" onClick={() => insertProjectTag('link')} className="toolbar-btn" title="Insert Anchor Link">
                  <i className="fa-solid fa-link"></i> Link
                </button>
                <button type="button" onClick={() => insertProjectTag('code')} className="toolbar-btn" title="Insert Code Block">
                  <i className="fa-solid fa-code"></i> Code
                </button>
                <button type="button" onClick={() => insertProjectTag('ul')} className="toolbar-btn" title="Add Unordered List">
                  <i className="fa-solid fa-list-ul"></i> List
                </button>
              </div>

              <textarea
                ref={projectBodyRef}
                required
                placeholder="## Overview&#10;Describe the project, challenges, and implementation details..."
                className="form-input form-textarea toolbar-editor-textarea font-mono"
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              />
            </div>

            {/* Split Screen Preview */}
            <div className="editor-preview-container">
              <div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center">
                  <i className="fa-solid fa-cloud-arrow-up"></i> {isLoading ? 'Saving...' : 'Save Project to Supabase'}
                </button>
              </div>
              <div className="preview-panel">
                <div className="preview-header select-none">
                  <span><i className="fa-regular fa-eye"></i> Rendered Live Case Study Preview</span>
                  <span className="font-mono text-xs">Markdown Parsed</span>
                </div>
                <article className="article-content select-text prose prose-invert">
                  <h1 className="text-3xl font-extrabold font-mono mb-4 text-[var(--text)]">{editingProject.title || 'Project Title'}</h1>
                  <p className="text-lg text-[var(--text2)] mb-4">{editingProject.tagline || 'Project tagline'}</p>
                  <div dangerouslySetInnerHTML={renderPreview(editingProject.description || '')} />
                </article>
              </div>
            </div>
          </form>
        </div>
      ) : editingPackage ? (
        /* ─────────────────────────────────────────────
           PACKAGE EDIT SCREEN
           ───────────────────────────────────────────── */
        <div className="admin-card">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)] select-none">
            <h2 className="font-mono text-lg font-bold text-[var(--text)]">
              {editingPackage.id ? 'Edit Package' : 'New Package'}
            </h2>
            <button onClick={() => setEditingPackage(null)} className="btn-outline btn-sm">
              Cancel
            </button>
          </div>

          <form onSubmit={handleSavePackage}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Package Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Django Var CMS"
                  className="form-input"
                  value={editingPackage.title || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="django-var-cms"
                  className="form-input font-mono"
                  value={editingPackage.slug || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, slug: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea
                required
                className="form-input"
                style={{ height: '60px' }}
                value={editingPackage.description || ''}
                onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  className="form-input font-mono"
                  value={editingPackage.github_url || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, github_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Docs URL</label>
                <input
                  type="url"
                  className="form-input font-mono"
                  value={editingPackage.docs_url || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, docs_url: e.target.value })}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Logo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="form-input font-mono"
                  value={editingPackage.logo_url || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, logo_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingPackage.sort_order || 0}
                  onChange={(e) => setEditingPackage({ ...editingPackage, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Publishers List */}
            <div className="mt-8 mb-6 p-4 border border-[var(--border)] bg-black/20 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <label className="form-label !mb-0">Published Platforms (PyPI, npm, etc)</label>
                <button type="button" onClick={handleAddPublisher} className="btn-outline btn-sm py-1">
                  <i className="fa-solid fa-plus"></i> Add Publisher
                </button>
              </div>

              {editingPackage.publishers?.length === 0 && (
                <p className="text-xs text-[var(--text3)] font-mono py-2">No publishers added yet.</p>
              )}

              {editingPackage.publishers?.map((pub, index) => (
                <div key={index} className="flex gap-3 mb-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Name (e.g. PyPI)"
                      className="form-input text-sm py-2 mb-2"
                      value={pub.platform_name || ''}
                      onChange={(e) => handleUpdatePublisher(index, 'platform_name', e.target.value)}
                      required
                    />
                    <input
                      type="url"
                      placeholder="URL (e.g. https://pypi.org/...)"
                      className="form-input text-sm py-2 font-mono"
                      value={pub.platform_url || ''}
                      onChange={(e) => handleUpdatePublisher(index, 'platform_url', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-48">
                    <input
                      type="text"
                      placeholder="Icon Class (fa-brands fa-python)"
                      className="form-input text-sm py-2 font-mono"
                      value={pub.icon_class || ''}
                      onChange={(e) => handleUpdatePublisher(index, 'icon_class', e.target.value)}
                    />
                  </div>
                  <button type="button" onClick={() => handleRemovePublisher(index)} className="btn-danger p-2 rounded-lg" title="Remove Publisher">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button type="button" onClick={() => setEditingPackage(null)} className="btn-outline">
                Discard
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Saving...' : 'Save Package'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
