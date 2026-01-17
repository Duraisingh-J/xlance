import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobService } from '../services/jobService';

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getOpenJobs();
        setJobs(Array.isArray(data) ? data : []);
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

  return (
    <JobsContext.Provider value={{ jobs, rawJobs: jobs, filters, setFilters, loading }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) return { jobs: [], loading: false, filters: {} };
  return context;
};
