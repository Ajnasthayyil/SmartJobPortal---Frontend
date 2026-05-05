export interface Course {
  id:          number;
  title:       string;
  platform:    'YouTube' | 'Udemy' | 'Coursera' | 'freeCodeCamp' | 'Official';
  instructor:  string;
  duration:    string;
  rating:      number;
  reviews:     string;
  price:       string;
  isFree:      boolean;
  level:       'Beginner' | 'Intermediate' | 'Advanced';
  tags:        string[];        // skill tags for filtering
  category:    string;
  thumbnail:   string;         // emoji fallback
  url:         string;         // real link
  description: string;
}

export const COURSES: Course[] = [
  // ── Web Development ───────────────────────────────────────
  {
    id: 1,
    title: 'React - The Complete Guide 2024',
    platform: 'Udemy',
    instructor: 'Maximilian Schwarzmüller',
    duration: '68 hrs',
    rating: 4.8,
    reviews: '192k',
    price: '₹499',
    isFree: false,
    level: 'Beginner',
    tags: ['React', 'JavaScript', 'Frontend'],
    category: 'Frontend',
    thumbnail: '⚛️',
    url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    description: 'Dive in and learn React.js from scratch — hooks, Redux, routing, and more.'
  },
  {
    id: 2,
    title: 'TypeScript Full Course for Beginners',
    platform: 'YouTube',
    instructor: 'Dave Gray',
    duration: '8 hrs',
    rating: 4.9,
    reviews: '450k views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['TypeScript', 'JavaScript', 'Frontend'],
    category: 'Frontend',
    thumbnail: '🔷',
    url: 'https://www.youtube.com/watch?v=30LWjhZzg50',
    description: 'Complete TypeScript tutorial covering all basics to advanced types.'
  },
  {
    id: 3,
    title: 'Next.js & React - The Complete Guide',
    platform: 'Udemy',
    instructor: 'Maximilian Schwarzmüller',
    duration: '25 hrs',
    rating: 4.7,
    reviews: '28k',
    price: '₹499',
    isFree: false,
    level: 'Intermediate',
    tags: ['Next.js', 'React', 'Frontend'],
    category: 'Frontend',
    thumbnail: '▲',
    url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/',
    description: 'Build full-stack apps with Next.js, server components, and more.'
  },
  {
    id: 4,
    title: 'Angular - The Complete Guide',
    platform: 'Udemy',
    instructor: 'Maximilian Schwarzmüller',
    duration: '35 hrs',
    rating: 4.6,
    reviews: '74k',
    price: '₹499',
    isFree: false,
    level: 'Beginner',
    tags: ['Angular', 'TypeScript', 'Frontend'],
    category: 'Frontend',
    thumbnail: '🔴',
    url: 'https://www.udemy.com/course/the-complete-guide-to-angular-2/',
    description: 'Master Angular with components, directives, services, and RxJS.'
  },

  // ── Backend ───────────────────────────────────────────────
  {
    id: 5,
    title: 'Node.js, Express, MongoDB Bootcamp',
    platform: 'Udemy',
    instructor: 'Jonas Schmedtmann',
    duration: '42 hrs',
    rating: 4.8,
    reviews: '94k',
    price: '₹499',
    isFree: false,
    level: 'Intermediate',
    tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
    category: 'Backend',
    thumbnail: '🟩',
    url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
    description: 'Build a full backend API with Node, Express, MongoDB, and security.'
  },
  {
    id: 6,
    title: 'C# and .NET - Full Course for Beginners',
    platform: 'YouTube',
    instructor: 'freeCodeCamp',
    duration: '9 hrs',
    rating: 4.8,
    reviews: '1.2M views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['C#', '.NET', 'ASP.NET', 'Backend'],
    category: 'Backend',
    thumbnail: '💜',
    url: 'https://www.youtube.com/watch?v=GhQdlIFylQ8',
    description: 'Learn C# programming fundamentals and build real applications.'
  },
  {
    id: 7,
    title: 'ASP.NET Core Web API - Full Course',
    platform: 'YouTube',
    instructor: 'Les Jackson',
    duration: '5 hrs',
    rating: 4.9,
    reviews: '600k views',
    price: 'Free',
    isFree: true,
    level: 'Intermediate',
    tags: ['ASP.NET', 'C#', '.NET', 'Backend', 'REST API'],
    category: 'Backend',
    thumbnail: '🔵',
    url: 'https://www.youtube.com/watch?v=fmvcAzHpsk8',
    description: 'Build a complete REST API with ASP.NET Core, EF Core, and SQL Server.'
  },
  {
    id: 8,
    title: 'Python for Everybody Specialization',
    platform: 'Coursera',
    instructor: 'University of Michigan',
    duration: '8 months',
    rating: 4.8,
    reviews: '260k',
    price: 'Free audit',
    isFree: true,
    level: 'Beginner',
    tags: ['Python', 'Backend', 'Data'],
    category: 'Backend',
    thumbnail: '🐍',
    url: 'https://www.coursera.org/specializations/python',
    description: 'Learn Python from scratch — data structures, APIs, databases.'
  },

  // ── Database ──────────────────────────────────────────────
  {
    id: 9,
    title: 'SQL for Data Science - Full Course',
    platform: 'YouTube',
    instructor: 'freeCodeCamp',
    duration: '4 hrs',
    rating: 4.7,
    reviews: '2.1M views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['SQL', 'Database', 'Data'],
    category: 'Database',
    thumbnail: '🗄️',
    url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    description: 'Complete SQL tutorial — queries, joins, subqueries, and aggregations.'
  },
  {
    id: 10,
    title: 'MongoDB — The Complete Developer Guide',
    platform: 'Udemy',
    instructor: 'Maximilian Schwarzmüller',
    duration: '17 hrs',
    rating: 4.7,
    reviews: '43k',
    price: '₹499',
    isFree: false,
    level: 'Beginner',
    tags: ['MongoDB', 'Database', 'NoSQL'],
    category: 'Database',
    thumbnail: '🍃',
    url: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/',
    description: 'Master MongoDB with aggregation, indexing, security, and Atlas.'
  },
  {
    id: 11,
    title: 'Redis Crash Course',
    platform: 'YouTube',
    instructor: 'Traversy Media',
    duration: '1 hr',
    rating: 4.8,
    reviews: '380k views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['Redis', 'Database', 'Caching'],
    category: 'Database',
    thumbnail: '🔴',
    url: 'https://www.youtube.com/watch?v=jgpVdJB2sKQ',
    description: 'Get up and running with Redis caching in one hour.'
  },

  // ── DevOps / Cloud ────────────────────────────────────────
  {
    id: 12,
    title: 'Docker Tutorial for Beginners',
    platform: 'YouTube',
    instructor: 'TechWorld with Nana',
    duration: '3 hrs',
    rating: 4.9,
    reviews: '4.2M views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['Docker', 'DevOps', 'Containers'],
    category: 'DevOps',
    thumbnail: '🐳',
    url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
    description: 'Learn Docker step by step — containers, images, compose, networking.'
  },
  {
    id: 13,
    title: 'AWS Certified Cloud Practitioner',
    platform: 'Official',
    instructor: 'Amazon Web Services',
    duration: '12 hrs',
    rating: 4.9,
    reviews: 'Official',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['AWS', 'Cloud', 'DevOps'],
    category: 'DevOps',
    thumbnail: '☁️',
    url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
    description: 'Official AWS training for the Cloud Practitioner certification.'
  },
  {
    id: 14,
    title: 'Kubernetes Tutorial for Beginners',
    platform: 'YouTube',
    instructor: 'TechWorld with Nana',
    duration: '4 hrs',
    rating: 4.9,
    reviews: '3.1M views',
    price: 'Free',
    isFree: true,
    level: 'Intermediate',
    tags: ['Kubernetes', 'DevOps', 'Docker'],
    category: 'DevOps',
    thumbnail: '⚙️',
    url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
    description: 'Full Kubernetes course — pods, deployments, services, ingress.'
  },

  // ── Data Science / AI ─────────────────────────────────────
  {
    id: 15,
    title: 'Machine Learning Specialization',
    platform: 'Coursera',
    instructor: 'Andrew Ng — Stanford',
    duration: '3 months',
    rating: 4.9,
    reviews: '180k',
    price: 'Free audit',
    isFree: true,
    level: 'Intermediate',
    tags: ['Machine Learning', 'Python', 'AI', 'Data Science'],
    category: 'Data Science',
    thumbnail: '🤖',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    description: 'Learn ML fundamentals with Andrew Ng — regression, neural networks, more.'
  },
  {
    id: 16,
    title: 'Data Structures & Algorithms in Python',
    platform: 'freeCodeCamp',
    instructor: 'freeCodeCamp',
    duration: '5 hrs',
    rating: 4.8,
    reviews: '1.8M views',
    price: 'Free',
    isFree: true,
    level: 'Intermediate',
    tags: ['DSA', 'Python', 'Algorithms', 'Data Structures'],
    category: 'Data Science',
    thumbnail: '📊',
    url: 'https://www.youtube.com/watch?v=pkYVOmU3MgA',
    description: 'Complete DSA course for coding interviews — arrays, trees, graphs.'
  },

  // ── Design / UI-UX ────────────────────────────────────────
  {
    id: 17,
    title: 'UI / UX Design Bootcamp',
    platform: 'Udemy',
    instructor: 'Daniel Walter Scott',
    duration: '31 hrs',
    rating: 4.7,
    reviews: '52k',
    price: '₹499',
    isFree: false,
    level: 'Beginner',
    tags: ['UI/UX', 'Figma', 'Design'],
    category: 'Design',
    thumbnail: '🎨',
    url: 'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/',
    description: 'Learn UI/UX design from scratch using Figma — wireframes to prototypes.'
  },
  {
    id: 18,
    title: 'Figma Tutorial - Full Course',
    platform: 'YouTube',
    instructor: 'DesignCourse',
    duration: '2 hrs',
    rating: 4.8,
    reviews: '820k views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['Figma', 'Design', 'UI/UX'],
    category: 'Design',
    thumbnail: '✏️',
    url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
    description: 'Get started with Figma for UI design — components, auto-layout, prototyping.'
  },

  // ── Soft Skills / Career ──────────────────────────────────
  {
    id: 19,
    title: 'Communication Skills for Beginners',
    platform: 'Coursera',
    instructor: 'University of Colorado',
    duration: '4 weeks',
    rating: 4.6,
    reviews: '32k',
    price: 'Free audit',
    isFree: true,
    level: 'Beginner',
    tags: ['Communication', 'Soft Skills', 'Career'],
    category: 'Soft Skills',
    thumbnail: '🗣️',
    url: 'https://www.coursera.org/learn/communication-skills',
    description: 'Improve your written and verbal communication for the workplace.'
  },
  {
    id: 20,
    title: 'Git and GitHub Full Course',
    platform: 'YouTube',
    instructor: 'freeCodeCamp',
    duration: '4 hrs',
    rating: 4.9,
    reviews: '3.5M views',
    price: 'Free',
    isFree: true,
    level: 'Beginner',
    tags: ['Git', 'GitHub', 'DevOps', 'Version Control'],
    category: 'DevOps',
    thumbnail: '🐙',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    description: 'Learn Git version control and GitHub from scratch — branching, merging, PRs.'
  }
];

// All unique categories
export const CATEGORIES = [
  'All', 'Frontend', 'Backend', 'Database',
  'DevOps', 'Data Science', 'Design', 'Soft Skills'
];

// All unique skill tags for filtering
export const SKILL_TAGS = [
  'All', 'React', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Python', 'C#', 'ASP.NET', 'SQL',
  'MongoDB', 'Docker', 'AWS', 'Kubernetes', 'Redis',
  'Machine Learning', 'UI/UX', 'Figma', 'Git'
];

// Platform colors
export const PLATFORM_CONFIG: Record<string, {
  color: string; bg: string; label: string
}> = {
  YouTube:      { color: '#dc2626', bg: '#fee2e2',  label: 'YouTube'       },
  Udemy:        { color: '#7c3aed', bg: '#ede9fe',  label: 'Udemy'         },
  Coursera:     { color: '#1d4ed8', bg: '#dbeafe',  label: 'Coursera'      },
  freeCodeCamp: { color: '#065f46', bg: '#d1fae5',  label: 'freeCodeCamp'  },
  Official:     { color: '#92400e', bg: '#fef3c7',  label: 'Official'      }
};