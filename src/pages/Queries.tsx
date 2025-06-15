import React from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import QueryEditor from '@/components/QueryEditor';
import { useAuth } from "@/hooks/useAuth";

const Queries = () => {
  useAuth({ redirectTo: "/auth" }); // Protect this route

  return (
    <div className="min-h-screen bg-query-gradient">
      <ParticleBackground />
      <Navbar />
      <QueryEditor />
    </div>
  );
};

export default Queries;
