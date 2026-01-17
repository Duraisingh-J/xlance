import React from 'react';
import {
  HeroSection,
  ServicesSection,
  NichesSection,
  WhyChooseUs,
  HowItWorks,
  CTASection,
} from '../components/home';
import PageTransition from '../components/common/PageTransition';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      // Default to freelancer dashboard if role isn't loaded yet or matches
      const Role = userProfile?.role?.includes('client') ? 'client' : 'freelancer';
      navigate(`/dashboard/${Role}`, { replace: true });
    }
  }, [user, userProfile, navigate]);

  return (
    <PageTransition>
      <main>
        <HeroSection />
        <ServicesSection />
        <NichesSection />
        <WhyChooseUs />
        <HowItWorks />
        <CTASection />
      </main>
    </PageTransition>
  );
};

export default HomePage;
