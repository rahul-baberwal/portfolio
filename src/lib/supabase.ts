import { createClient } from '@supabase/supabase-js';
import { fallbackPosts, fallbackProjects } from './fallback-data';
import { Post, Project } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client if credentials are provided, else keep null
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetches all published blog posts.
 */
export async function getPosts(): Promise<Post[]> {
  if (!supabase) {
    return fallbackPosts;
  }
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    // If DB is empty (not yet seeded), fall back to local data
    const posts = (data || []) as Post[];
    return posts.length > 0 ? posts : fallbackPosts;
  } catch (err) {
    console.warn('Supabase fetch failed (posts). Falling back to local data.', err);
    return fallbackPosts;
  }
}

/**
 * Fetches a single published blog post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabase) {
    return fallbackPosts.find(p => p.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    return data as Post;
  } catch (err: any) {
    // PGRST116 = 0 rows — post not yet in DB, silently use local fallback
    if (err?.code !== 'PGRST116') {
      console.warn(`Supabase fetch failed (post: ${slug}). Falling back to local data.`, err);
    }
    return fallbackPosts.find(p => p.slug === slug) || null;
  }
}

/**
 * Fetches all projects, sorted by sort_order.
 */
export async function getProjects(): Promise<Project[]> {
  if (!supabase) {
    return fallbackProjects;
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    // If DB is empty (not yet seeded), fall back to local data
    const projects = (data || []) as Project[];
    return projects.length > 0 ? projects : fallbackProjects;
  } catch (err) {
    console.warn('Supabase fetch failed (projects). Falling back to local data.', err);
    return fallbackProjects;
  }
}

/**
 * Fetches a single project by its slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!supabase) {
    return fallbackProjects.find(p => p.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data as Project;
  } catch (err) {
    console.warn(`Supabase fetch failed (project: ${slug}). Falling back to local data.`, err);
    return fallbackProjects.find(p => p.slug === slug) || null;
  }
}

/**
 * Inserts or updates a blog post.
 */
export async function upsertPost(post: Partial<Post>): Promise<Post> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }
  
  // If the ID is a temp string (e.g., '1'), let Supabase generate a proper UUID
  const isTempId = post.id && !post.id.includes('-');
  const { id, ...postData } = post;
  
  const payload = isTempId || !post.id ? postData : post;
  const query = post.id && !isTempId
    ? supabase.from('posts').upsert(payload)
    : supabase.from('posts').insert(payload);

  const { data, error } = await query.select().single();

  if (error) throw error;
  return data as Post;
}

/**
 * Deletes a blog post by id.
 */
export async function deletePost(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Inserts or updates a project.
 */
export async function upsertProject(project: Partial<Project>): Promise<Project> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }

  // If the ID is a temp string (e.g., 'project1'), let Supabase generate a proper UUID
  const isTempId = project.id && !project.id.includes('-');
  const { id, ...projectData } = project;
  
  const payload = isTempId || !project.id ? projectData : project;
  const query = project.id && !isTempId
    ? supabase.from('projects').upsert(payload)
    : supabase.from('projects').insert(payload);

  const { data, error } = await query.select().single();

  if (error) throw error;
  return data as Project;
}

/**
 * Deletes a project by id.
 */
export async function deleteProject(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Fetches all packages, including their publishers, sorted by sort_order.
 */
export async function getPackages(): Promise<any[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*, publishers:package_publishers(*)')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetch failed (packages).', err);
    return [];
  }
}

/**
 * Inserts or updates a package.
 */
export async function upsertPackage(pkg: Partial<any>): Promise<any> {
  if (!supabase) throw new Error('Supabase client not initialized.');

  // Extract publishers from the package payload as we handle them separately
  const { publishers, ...pkgData } = pkg;
  const isTempId = pkgData.id && !pkgData.id.includes('-');
  const { id, ...payloadWithoutId } = pkgData;

  const payload = isTempId || !pkgData.id ? payloadWithoutId : pkgData;
  const query = pkgData.id && !isTempId
    ? supabase.from('packages').upsert(payload)
    : supabase.from('packages').insert(payload);

  const { data: savedPkg, error: pkgError } = await query.select().single();
  if (pkgError) throw pkgError;

  // Handle publishers
  if (publishers && Array.isArray(publishers)) {
    // Delete existing publishers to replace them
    if (savedPkg.id) {
      await supabase.from('package_publishers').delete().eq('package_id', savedPkg.id);
    }
    
    if (publishers.length > 0) {
      const publishersPayload = publishers.map(pub => ({
        package_id: savedPkg.id,
        platform_name: pub.platform_name,
        platform_url: pub.platform_url,
        icon_class: pub.icon_class
      }));
      const { error: pubError } = await supabase.from('package_publishers').insert(publishersPayload);
      if (pubError) throw pubError;
    }
  }

  // Refetch to get the complete object
  const { data: finalData } = await supabase
    .from('packages')
    .select('*, publishers:package_publishers(*)')
    .eq('id', savedPkg.id)
    .single();

  return finalData;
}

/**
 * Deletes a package by id.
 */
export async function deletePackage(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase client not initialized.');
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

