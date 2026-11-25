import { Experience, SkillCategory } from './types';

export const staticExperiences: Experience[] = [
  {
    id: 'exp1',
    date: 'Jul 2026 – Present',
    title: 'Software Developer',
    company: 'AdsToPlay',
    description: 'TODO: Add 2–3 verb-led bullets describing work at AdsToPlay.',
  },
  {
    id: 'exp2',
    date: 'Aug 2025 – Jun 2026',
    title: 'Back End Developer',
    company: 'Groww Per Click',
    description: 'TODO: Add 2–3 verb-led bullets describing work at Groww Per Click.',
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
    date: 'Completed TODO: add year',
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
    tags: ['Python', 'Django', 'DRF', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
  },
  {
    title: 'AI / Data',
    icon: 'fa-solid fa-brain',
    tags: ['scikit-learn', 'Pandas', 'NumPy', 'NLP / SBERT'],
  },
  {
    title: 'Frontend',
    icon: 'fa-solid fa-code',
    tags: ['JavaScript', 'React', 'HTML', 'CSS'],
  },
  {
    title: 'Tools',
    icon: 'fa-solid fa-screwdriver-wrench',
    tags: ['Git', 'GitHub', 'GitLab', 'Linux', 'Postman'],
  },
];
