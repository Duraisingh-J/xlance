export const mockJobs = [
  {
    id: '1',
    clientId: 'client-1',
    title: 'Senior React Developer for Fintech Platform',
    description: 'We are looking for an experienced React developer to lead the frontend migration of our flagship trading platform. You will work closely with our backend team to ensure real-time data performance.',
    category: 'Development & IT',
    subCategory: 'Web Development',
    budgetType: 'hourly',
    budget: { min: 4000, max: 8000, rate: 6000 }, // hourly rate in INR
    duration: '3 to 6 months',
    level: 'expert',
    skills: ['React', 'TypeScript', 'Redux', 'WebSocket'],
    proposals: 12,
    client: {
      name: 'FinTech Solutions Ltd.',
      location: 'Mumbai, India',
      verified: true,
      spent: '₹5L+ spent',
      rating: 4.9
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'open',
    isPromoted: true,
  },
  {
    id: '2',
    clientId: 'client-2',
    title: 'Modern Minimalist Logo Design for Coffee Brand',
    description: 'Seeking a creative designer to craft a unique, minimalist logo for our new premium coffee brand "Aroma". Deliverables include source files and brand guidelines.',
    category: 'Design & Creative',
    subCategory: 'Logo Design',
    budgetType: 'fixed',
    budget: { fixed: 15000 },
    duration: '1 to 4 weeks',
    level: 'intermediate',
    skills: ['Logo Design', 'Adobe Illustrator', 'Branding'],
    proposals: 45,
    client: {
      name: 'Aroma Coffee',
      location: 'Bangalore, India',
      verified: true,
      spent: '₹50k+ spent',
      rating: 4.5
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'open',
    isPromoted: false,
  },
  {
    id: '3',
    clientId: 'client-3',
    title: 'AI Chatbot Integration using OpenAI API',
    description: 'Need a Python expert to integrate GPT-4 into our customer support dashboard. The bot should handle FAQs and route complex queries to human agents.',
    category: 'AI Services',
    subCategory: 'AI Development',
    budgetType: 'fixed',
    budget: { fixed: 120000 },
    duration: '1 to 3 months',
    level: 'expert',
    skills: ['Python', 'OpenAI', 'LangChain', 'API Integration'],
    proposals: 8,
    client: {
      name: 'TechFlow Systems',
      location: 'Remote',
      verified: false,
      spent: '₹0 spent',
      rating: 0
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    status: 'open',
    isPromoted: true,
  },
  {
    id: '4',
    clientId: 'client-4',
    title: 'SEO Content Writer for Travel Blog',
    description: 'Looking for a native writer to create 10 high-quality, SEO-optimized articles about "Hidden Gems in India". Must have experience in travel niches.',
    category: 'Writing & Translation',
    subCategory: 'Article Writing',
    budgetType: 'fixed',
    budget: { fixed: 5000 },
    duration: 'Less than 1 month',
    level: 'beginner',
    skills: ['Content Writing', 'SEO', 'Creative Writing'],
    proposals: 2,
    client: {
      name: 'Wanderlust Media',
      location: 'Delhi, India',
      verified: true,
      spent: '₹20k+ spent',
      rating: 4.8
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    status: 'open',
    isPromoted: false,
  },
  {
    id: '5',
    clientId: 'client-5',
    title: 'Full Stack MERN Developer for SaaS MVP',
    description: 'Building an MVP for a project management tool. Need someone proficient in MongoDB, Express, React, and Node.js to fast-track development.',
    category: 'Development & IT',
    subCategory: 'Full Stack',
    budgetType: 'hourly',
    budget: { min: 1500, max: 2500, rate: 2000 }, // hourly
    duration: '3 to 6 months',
    level: 'intermediate',
    skills: ['MERN Stack', 'Redux', 'Tailwind CSS'],
    proposals: 15,
    client: {
      name: 'StartUp Hub',
      location: 'Hyderabad, India',
      verified: true,
      spent: '₹2L+ spent',
      rating: 4.7
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: 'open',
    isPromoted: false,
  },
];

export const mockFreelancers = [
  // Development & IT
  {
    id: 'f-dev-1',
    name: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Full-stack developer with 5+ years experience in React and Node.js',
    location: 'Bangalore, India',
    hourlyRate: 800,
    rating: 4.8,
    category: 'Development & IT',
    experience: '5 Years'
  },
  {
    id: 'f-dev-2',
    name: 'Arjun Reddy',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Senior Backend Engineer specializing in Python and Go.',
    location: 'Hyderabad, India',
    hourlyRate: 1200,
    rating: 4.9,
    category: 'Development & IT',
    experience: '8 Years'
  },
  {
    id: 'f-dev-3',
    name: 'Sneha Gupta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Frontend Specialist | React | Vue | Tailwind CSS Master',
    location: 'Pune, India',
    hourlyRate: 900,
    rating: 4.7,
    category: 'Development & IT',
    experience: '4 Years'
  },
  {
    id: 'f-dev-4',
    name: 'Karthik S',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Mobile App Developer (Flutter & React Native)',
    location: 'Chennai, India',
    hourlyRate: 1000,
    rating: 4.6,
    category: 'Development & IT',
    experience: '3 Years'
  },

  // Design & Creative
  {
    id: 'f-des-1',
    name: 'Priya Singh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'UI/UX Designer specializing in mobile apps and SaaS platforms',
    location: 'Mumbai, India',
    hourlyRate: 600,
    rating: 4.9,
    category: 'Design & Creative',
    experience: '7 Years'
  },
  {
    id: 'f-des-2',
    name: 'Aisha Khan',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Brand Identity & Logo Design Specialist',
    location: 'Delhi, India',
    hourlyRate: 500,
    rating: 4.8,
    category: 'Design & Creative',
    experience: '5 Years'
  },
  {
    id: 'f-des-3',
    name: 'Rohan Jha',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Illustrator and Graphic Artist',
    location: 'Kolkata, India',
    hourlyRate: 450,
    rating: 4.7,
    category: 'Design & Creative',
    experience: '4 Years'
  },

  // Writing & Translation
  {
    id: 'f-wri-1',
    name: 'Anjali Desai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80',
    role: 'freelancer',
    bio: 'SEO Content Writer and Copywriting Specialist',
    location: 'Mumbai, India',
    hourlyRate: 500,
    rating: 4.7,
    category: 'Writing & Translation',
    experience: '3 Years'
  },
  {
    id: 'f-wri-2',
    name: 'Neeraj Pandey',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Technical Writer | API Documentation | Whitepapers',
    location: 'Bangalore, India',
    hourlyRate: 900,
    rating: 4.9,
    category: 'Writing & Translation',
    experience: '10 Years'
  },
  {
    id: 'f-wri-3',
    name: 'Meera Nair',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Professional Translator (English, Hindi, Spanish, French)',
    location: 'Kochi, India',
    hourlyRate: 700,
    rating: 4.8,
    category: 'Writing & Translation',
    experience: '6 Years'
  },

  // AI Services
  {
    id: 'f-ai-1',
    name: 'Vikram Malhotra',
    avatar: 'https://images.unsplash.com/photo-1560250097-9b93dbddb426?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'AI/ML Engineer specializing in NLP and Computer Vision',
    location: 'Gurgaon, India',
    hourlyRate: 2500,
    rating: 5.0,
    category: 'AI Services',
    experience: '6 Years'
  },
  {
    id: 'f-ai-2',
    name: 'Sonia Mehta',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Data Scientist | Machine Learning | Deep Learning',
    location: 'Hyderabad, India',
    hourlyRate: 2000,
    rating: 4.8,
    category: 'AI Services',
    experience: '4 Years'
  },
  {
    id: 'f-ai-3',
    name: 'Amit Verma',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'AI Chatbot Developer | OpenAI API Expert',
    location: 'Noida, India',
    hourlyRate: 1800,
    rating: 4.7,
    category: 'AI Services',
    experience: '3 Years'
  },

  // Sales & Marketing
  {
    id: 'f-mar-1',
    name: 'Kabir Das',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Digital Marketing Strategist | SEO & SEM',
    location: 'Mumbai, India',
    hourlyRate: 1000,
    rating: 4.8,
    category: 'Sales & Marketing',
    experience: '7 Years'
  },
  {
    id: 'f-mar-2',
    name: 'Tina Roy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Social Media Manager & Content Strategist',
    location: 'Delhi, India',
    hourlyRate: 600,
    rating: 4.7,
    category: 'Sales & Marketing',
    experience: '4 Years'
  },
  {
    id: 'f-mar-3',
    name: 'Rajiv Kapoor',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'B2B Sales Expert | Lead Generation',
    location: 'Pune, India',
    hourlyRate: 900,
    rating: 4.9,
    category: 'Sales & Marketing',
    experience: '9 Years'
  },

  // Admin & Support
  {
    id: 'f-adm-1',
    name: 'Deepa Thomas',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Virtual Assistant | Data Entry Specialist',
    location: 'Chennai, India',
    hourlyRate: 400,
    rating: 4.9,
    category: 'Admin & Support',
    experience: '5 Years'
  },
  {
    id: 'f-adm-2',
    name: 'Varun Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Customer Support Executive | 24/7 Availability',
    location: 'Jaipur, India',
    hourlyRate: 300,
    rating: 4.6,
    category: 'Admin & Support',
    experience: '2 Years'
  },
  {
    id: 'f-adm-3',
    name: 'Simran Kaur',
    avatar: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    role: 'freelancer',
    bio: 'Project Coordinator & Admin Support',
    location: 'Chandigarh, India',
    hourlyRate: 700,
    rating: 4.8,
    category: 'Admin & Support',
    experience: '6 Years'
  }
];

export const mockProjects = [
  {
    id: 'proj-1',
    title: 'Fintech Dashboard Revamp',
    clientName: 'FinEdge Solutions',
    clientAvatar: 'FE',
    status: 'Active',
    progress: 65,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days left
    nextMilestone: 'Frontend Integration',
    budgetTotal: 120000,
    budgetConsumed: 75000,
    techStack: ['React', 'Tailwind', 'Chart.js'],
    milestones: [
      { id: 1, title: 'UX Research', completed: true },
      { id: 2, title: 'UI Design System', completed: true },
      { id: 3, title: 'Frontend Integration', completed: false },
      { id: 4, title: 'Backend Connection', completed: false },
    ]
  },
  {
    id: 'proj-2',
    title: 'E-commerce Mobile App',
    clientName: 'ShopKart Inc.',
    clientAvatar: 'SK',
    status: 'In Review',
    progress: 95,
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days left
    nextMilestone: 'Final Testing & Handoff',
    budgetTotal: 250000,
    budgetConsumed: 220000,
    techStack: ['React Native', 'Firebase', 'Redux'],
    milestones: [
      { id: 1, title: 'Core Features', completed: true },
      { id: 2, title: 'Payment Gateway', completed: true },
      { id: 3, title: 'Admin Panel', completed: true },
      { id: 4, title: 'App Store Submission', completed: false },
    ]
  },
  {
    id: 'proj-3',
    title: 'Corporate Branding Pack',
    clientName: 'Alpha Corp',
    clientAvatar: 'AC',
    status: 'Completed',
    progress: 100,
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 1 month ago
    nextMilestone: 'Project Closed',
    budgetTotal: 45000,
    budgetConsumed: 45000,
    techStack: ['Illustrator', 'Photoshop', 'Indesign'],
    milestones: [
      { id: 1, title: 'Logo Concepts', completed: true },
      { id: 2, title: 'Brand Guidelines', completed: true },
      { id: 3, title: 'Stationery Kit', completed: true },
    ]
  }
];

export const mockChats = [
  {
    id: 'c1',
    userId: 'u2',
    name: 'Sarah Jenkins',
    avatar: 'SJ',
    status: 'online',
    lastMessage: 'The new designs look fantastic! When can we review?',
    time: '10:42 AM',
    unread: 2
  },
  {
    id: 'c2',
    userId: 'u3',
    name: 'Michael Chen',
    avatar: 'MC',
    status: 'offline',
    lastMessage: 'Payment has been released for the first milestone.',
    time: 'Yesterday',
    unread: 0
  },
  {
    id: 'c3',
    userId: 'u4',
    name: 'David Wilson',
    avatar: 'DW',
    status: 'online',
    lastMessage: 'Perfect, thanks for the update.',
    time: 'Tue',
    unread: 0
  }
];

export const mockChatMessages = {
  c1: [
    { id: 'm1', fromMe: false, text: 'Hi! Just checking in on the progress.', time: '10:30 AM' },
    { id: 'm2', fromMe: true, text: 'Hey Sarah! Making good progress. I will have a preview ready by EOD.', time: '10:35 AM' },
    { id: 'm3', fromMe: false, text: 'That is great news.', time: '10:40 AM' },
    { id: 'm4', fromMe: false, text: 'The new designs look fantastic! When can we review?', time: '10:42 AM' }
  ],
  c2: [
    { id: 'm1', fromMe: true, text: 'Milestone 1 is complete. Please check the dashboard.', time: 'Yesterday' },
    { id: 'm2', fromMe: false, text: 'Payment has been released for the first milestone.', time: 'Yesterday' }
  ],
  c3: [
    { id: 'm1', fromMe: true, text: 'Here are the final assets.', time: 'Tue' },
    { id: 'm2', fromMe: false, text: 'Perfect, thanks for the update.', time: 'Tue' }
  ]
};
