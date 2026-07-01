import { Experience, SkillCategory } from './types';

export const staticExperiences: Experience[] = [
  {
    id: 'exp1',
    date: 'Jul 2026 – Present',
    title: 'Full Stack Developer',
    company: 'AdsToPlay',
    description: 'Designing and building high-performance full-stack web applications, REST APIs, and interactive interfaces. Leveraging React, PHP, Python, and modern web technologies to optimize game and ad tech platforms.',
  },
  {
    id: 'exp2',
    date: 'Aug 2025 – Jun 2026',
    title: 'Back End Developer',
    company: 'Groww Per Click',
    description: 'Building and maintaining scalable backend systems, REST APIs, and server-side logic using Python. Contributing to product infrastructure in a fast-paced fintech environment.',
  },
  {
    id: 'exp3',
    date: 'Aug 2024 – Oct 2025',
    title: 'Major in Artificial Intelligence',
    company: 'Indian Institute of Technology, Ropar',
    description: 'Pursuing advanced studies in AI — covering machine learning, deep learning, natural language processing, computer vision, and pattern recognition. Exploring applications like autonomous vehicles, driving car simulations, and collaborating with machine learning engineers.',
  },
  {
    id: 'exp4',
    date: '2024',
    title: 'MSc Computer Science (ongoing)',
    company: 'Mohta College, MGSU University Bikaner',
    description: 'Pursuing MSc Computer Science at Mohta College, MGSU University Bikaner, covering algorithms, distributed systems, and advanced software engineering.',
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
    title: 'Frontend',
    icon: 'fa-solid fa-code',
    tags: ['Python', 'JavaScript', 'HTML5', 'CSS3', 'SCSS'],
  },
  {
    title: 'Backend & Infra',
    icon: 'fa-solid fa-server',
    tags: ['Django', 'Django REST', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'Celery', 'Channels'],
  },
  {
    title: 'AI / Data Science',
    icon: 'fa-solid fa-brain',
    tags: ['Machine Learning', 'scikit-learn', 'Pandas', 'NumPy', 'Data Visualization', 'NLP / SBERT'],
  },
  {
    title: 'Tools',
    icon: 'fa-solid fa-screwdriver-wrench',
    tags: ['Git', 'GitHub', 'GitLab', 'Linux', 'VS Code', 'Postman'],
  },
];
