import { Experience, SkillCategory } from './types';

export const staticExperiences: Experience[] = [
  {
    id: 'exp1',
    date: 'Jul 2026 – Present',
    title: 'Software Developer',
    company: 'AdsToPlay',
    description: '',
    bullets: [
      'Build web apps, REST APIs and UIs with React, PHP and Python.',
      'Develop internal admin dashboards, workflow automation and data tools.',
      'Deliver client sites end to end, including Bael Leaves (9-language i18n).',
      'Optimise data flows and application performance across the stack.',
    ],
  },
  {
    id: 'exp2',
    date: 'Aug 2025 – Jun 2026',
    title: 'Full Stack Developer',
    company: 'Groww Per Click',
    description: '',
    bullets: [
      "Architected EasySpin's 3-sided DRF backend with RBAC and order lifecycle.",
      'Built a Django admin back-office for users, stores and riders.',
      'Built a Django SaaS for lab report generation with RBAC.',
      'Built a Django CRM, inventory and raw-material management SaaS.',
      'Owned REST API design, PostgreSQL schemas, admin dashboards and web UI.',
    ],
  },
  {
    id: 'exp3',
    date: 'Aug 2024 – Oct 2025 (Completed)',
    title: 'Major in Artificial Intelligence',
    company: 'Indian Institute of Technology, Ropar',
    description: 'Completed an AI Major covering machine learning, deep learning, natural language processing, computer vision, and pattern recognition.',
  },
  {
    id: 'exp4',
    date: 'Aug 2024 – Sep 2026',
    title: 'MSc Computer Science',
    company: 'Mohta College, MGSU University Bikaner',
    description: 'Completed MSc Computer Science at Mohta College, MGSU University Bikaner, covering algorithms, distributed systems, and advanced software engineering.',
  },
  {
    id: 'exp5',
    date: 'Jul 2022 – Jan 2024',
    title: 'O Level — IT Professional',
    company: 'NIELIT (National Institute of Electronics & Information Tech)',
    description: 'Completed NIELIT O Level certification in Computer and Information Sciences, gaining strong foundations in programming, networking, and IT fundamentals.',
  },
];

export const staticSkills: SkillCategory[] = [
  {
    title: 'Mobile',
    icon: 'fa-solid fa-mobile-screen',
    tags: ['Kotlin', 'Java', 'Jetpack Compose', 'Android SDK', 'Room', 'WorkManager', 'MapLibre'],
  },
  {
    title: 'Backend',
    icon: 'fa-solid fa-server',
    tags: [
      'Python',
      'Django',
      'DRF',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'Celery',
      'Docker',
      'QR codes',
      'REST API design',
      'role-based access control (RBAC)',
      'Django admin customisation',
      'SaaS application architecture',
      'relational data modelling',
    ],
  },
  {
    title: 'AI / Data',
    icon: 'fa-solid fa-brain',
    tags: ['scikit-learn', 'Pandas', 'NumPy', 'NLP / SBERT'],
  },
  {
    title: 'Frontend',
    icon: 'fa-solid fa-code',
    tags: ['JavaScript', 'React', 'HTML', 'CSS', 'i18n/localisation'],
  },
  {
    title: 'Tools',
    icon: 'fa-solid fa-screwdriver-wrench',
    tags: ['Git', 'GitHub', 'GitLab', 'Linux', 'Postman', 'workflow automation'],
  },
];
