
import React from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-query-gradient overflow-hidden flex flex-col">
      <ParticleBackground />
      <Navbar />
      <div className="flex-1">
        <HeroSection />
      </div>
      <footer className="text-center py-4 text-gray-400 text-sm relative z-10">
        © 2025 QueryGenie. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
