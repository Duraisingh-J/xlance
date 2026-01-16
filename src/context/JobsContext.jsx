import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { jobService } from '../services/jobService';

const JobsContext = createContext(null);

const jobTemplates = [
  { title: 'Senior React Developer for Fintech App', desc: 'Build a modern fintech dashboard with React, TypeScript, and real-time data visualization. Must have 5+ years experience.', skills: ['React', 'TypeScript', 'Redux', 'Tailwind'], category: 'Development', level: 'Expert' },
  { title: 'UI/UX Designer for Mobile App', desc: 'Design intuitive interfaces for a food delivery mobile app. Experience with Figma and user research required.', skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'], category: 'Design', level: 'Intermediate' },
  { title: 'Full Stack Developer - E-commerce Platform', desc: 'Develop and maintain a high-traffic e-commerce platform using Node.js and React. Experience with payment gateways essential.', skills: ['Node.js', 'React', 'MongoDB', 'AWS'], category: 'Development', level: 'Expert' },
  { title: 'Content Writer for Tech Blog', desc: 'Write engaging technical articles about AI, web development, and emerging technologies. 3+ articles per week.', skills: ['Writing', 'SEO', 'Tech', 'Research'], category: 'Writing', level: 'Beginner' },
  { title: 'Digital Marketing Specialist', desc: 'Plan and execute digital marketing campaigns across social media, email, and paid ads. Analytics experience needed.', skills: ['Marketing', 'SEO', 'Google Ads', 'Analytics'], category: 'Marketing', level: 'Intermediate' },
  { title: 'Python Developer for AI Project', desc: 'Build machine learning models and data pipelines for AI-powered recommendation system.', skills: ['Python', 'TensorFlow', 'AI', 'Data Science'], category: 'Development', level: 'Expert' },
  { title: 'Graphic Designer for Brand Identity', desc: 'Create comprehensive brand identity including logo, color palette, and marketing materials for startup.', skills: ['Illustrator', 'Photoshop', 'Branding', 'Design'], category: 'Design', level: 'Intermediate' },
  { title: 'WordPress Developer', desc: 'Customize WordPress themes and develop custom plugins for client websites. PHP and JavaScript required.', skills: ['WordPress', 'PHP', 'JavaScript', 'CSS'], category: 'Development', level: 'Beginner' },
  { title: 'Social Media Manager', desc: 'Manage social media presence across Instagram, LinkedIn, and Twitter. Create content calendar and engage with audience.', skills: ['Social Media', 'Content', 'Marketing', 'Canva'], category: 'Marketing', level: 'Beginner' },
  { title: 'Mobile App Developer (Flutter)', desc: 'Develop cross-platform mobile applications using Flutter. Experience with Firebase and REST APIs required.', skills: ['Flutter', 'Dart', 'Firebase', 'Mobile'], category: 'Development', level: 'Intermediate' },
  { title: 'Video Editor for YouTube Channel', desc: 'Edit engaging videos for tech YouTube channel. Experience with Premiere Pro and After Effects preferred.', skills: ['Premiere Pro', 'After Effects', 'Video Editing', 'Motion Graphics'], category: 'Design', level: 'Beginner' },
  { title: 'SEO Specialist', desc: 'Optimize website for search engines, conduct keyword research, and implement SEO best practices.', skills: ['SEO', 'Analytics', 'Keyword Research', 'Link Building'], category: 'Marketing', level: 'Intermediate' },
];

const sampleJobs = Array.from({ length: 24 }).map((_, i) => {
  const template = jobTemplates[i % jobTemplates.length];
  const isHourly = i % 3 === 0;
  const recommended = i % 5 === 0;
  const hoursAgo = (i % 24) + 1;

  return {
    id: `job-${i + 1}`,
    title: template.title,
    desc: template.desc,
    skills: template.skills,
    moreSkills: Math.max(0, Math.floor(Math.random() * 3)),
    category: template.category,
    level: template.level,
    budgetType: isHourly ? 'Hourly' : 'Fixed',
    budget: isHourly
      ? { rate: 800 + (i % 8) * 100, estHours: 20 + (i % 40) }
      : { min: 15000 + (i * 1000), max: 40000 + (i * 2000) },
    client: {
      name: ['TechCorp India', 'StartupHub', 'Digital Ventures', 'InnovateLabs', 'CreativeStudio'][i % 5],
      verified: i % 3 === 0,
      location: ['Remote', 'India', 'Bangalore', 'Mumbai', 'Delhi'][i % 5],
    },
    posted: hoursAgo < 2 ? `${hoursAgo}h ago` : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`,
    recommended,
    proposals: i % 15,
    remote: ['Remote', 'India'].includes(['Remote', 'India', 'Bangalore', 'Mumbai', 'Delhi'][i % 5]),
  };
});

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real data fetching
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getOpenJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const [filters, setFilters] = useState({
    q: '',
    category: 'All',
    budgetType: 'All',
    level: 'All',
    location: 'All',
    remoteOnly: false,
    sort: 'Newest',
  });

  const [wishlist, setWishlist] = useState(() => new Set());

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const filtered = useMemo(() => {
    const q = (filters.q || '').toLowerCase().trim();
    let res = jobs.filter((j) => {
      // Search filter
      if (q) {
        const searchMatch =
          (j.title || "").toLowerCase().includes(q) ||
          (j.desc || j.description || "").toLowerCase().includes(q) ||
          (j.skills || []).join(' ').toLowerCase().includes(q) ||
          (j.client?.name || "").toLowerCase().includes(q);
        if (!searchMatch) return false;
      }

      // Basic Filters (You might need to adjust based on schema if fields are missing)
      // For now, simple filters

      if (filters.remoteOnly && j.client?.location !== 'Remote') {
        // This is a loose check, adjust as needed
      }

      return true;
    });

    // Sorting implementation can stay similar but fields might differ

    return res;
  }, [jobs, filters]);

  return (
    <JobsContext.Provider value={{ jobs: filtered, rawJobs: jobs, filters, setFilters, wishlist, toggleWishlist, loading }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => useContext(JobsContext);
