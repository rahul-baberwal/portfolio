import { Experience, SkillCategory } from './types';

export const staticExperiences: Experience[] = [
  {
    id: 'exp1',
    date: 'Jul 2026 – Present',
    title: 'Software Developer',
    company: 'AdsToPlay',
    description: '',
    bullets: [
      'Design and develop web applications, REST APIs and interactive interfaces for game and ad-tech platforms using React, PHP and Python.',
      'Build internal tools that support day-to-day operations: admin dashboards, workflow automation and data management interfaces used by the team.',
      'Delivered client websites end to end, including Bael Leaves (baelleaves.com), a multilingual lead-capture website with a circuit catalogue, inquiry form and i18n across nine languages.',
      'Optimise data flows and application performance across front end and back end.',
    ],
  },
  {
    id: 'exp2',
    date: 'Aug 2025 – Jun 2026',
    title: 'Full Stack Developer',
    company: 'Groww Per Click',
    description: '',
    bullets: [
      "Architected and built the backend of EasySpin, an on-demand laundry marketplace modelled on Zomato's three-sided model: a Django REST Framework API serving customer, store and rider apps, with role-based access control and an end-to-end order lifecycle.",
      'Developed a Django admin back-office to manage users, stores and riders, covering onboarding, order monitoring and operational controls.',
      'Built a web-based SaaS on Django for lab report generation: structured data models for tests and results, templated report generation and role-based access.',
      'Built a web-based business-management SaaS on Django covering lead generation and lead management (CRM-style), stock/inventory management and raw-material management, with modular apps, dashboards and reporting.',
      'Owned features across REST API design, relational schema design (PostgreSQL), admin dashboards and web UI.',
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
    date: 'Aug 2024 – Sep 2026 (Completed)',
    title: 'MSc Computer Science (Completed)',
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
