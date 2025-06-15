
import React from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import QueryEditor from '@/components/QueryEditor';

const Queries = () => {
  return (
    <div className="min-h-screen bg-query-gradient">
      <ParticleBackground />
      <Navbar />
      <QueryEditor />
    </div>
  );
};

export default Queries;
