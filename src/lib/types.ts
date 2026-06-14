export interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string; // Markdown content
  tags: string[];
  published_at: string;
  updated_at: string;
  published: boolean;
  read_time?: string; // Optional pre-calculated read time (e.g. "8 min read")
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string; // Markdown / Case study
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  cover_image?: string;
  featured: boolean;
  sort_order: number;
}

export interface Experience {
  id: string;
  date: string;
  title: string;
  company: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  icon: string; // FontAwesome class or name
  tags: string[];
}

export interface PackagePublisher {
  id?: string;
  platform_name: string; // e.g., 'PyPI'
  platform_url: string;
  icon_class?: string; // e.g., 'fa-brands fa-python'
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  description: string;
  docs_url?: string;
  github_url?: string;
  logo_url?: string;
  sort_order: number;
  publishers?: PackagePublisher[];
}
