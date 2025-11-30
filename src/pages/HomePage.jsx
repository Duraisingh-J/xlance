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

const HomePage = () => {
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
