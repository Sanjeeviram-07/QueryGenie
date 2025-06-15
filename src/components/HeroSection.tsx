
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const HeroSection = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!description.trim()) {
      toast({
        title: "Please describe your database",
        description: "Enter a description to generate SQL queries",
        variant: "destructive",
      });
      return;
    }

    // Store the description for later use
    localStorage.setItem('queryDescription', description);
    
    // Navigate to auth page for now (will be query editor later)
    navigate('/auth');
    
    toast({
      title: "Magic is happening! ✨",
      description: "Generating your perfect SQL queries...",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="text-center max-w-4xl mx-auto space-y-8">
        {/* Main Heading */}
        <div className="space-y-4 animate-slide-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins">
            <span className="glow-text">Your dream</span>
            <br />
            <span className="text-white">query builder</span>
          </h1>
          
          {/* Floating sparkles */}
          <div className="relative inline-block">
            <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-neon-violet animate-sparkle" />
            <Sparkles className="absolute -bottom-2 -left-6 h-4 w-4 text-soft-blue animate-sparkle" style={{ animationDelay: '1s' }} />
            <Sparkles className="absolute top-2 left-8 h-5 w-5 text-neon-violet animate-sparkle" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <div className="relative max-w-2xl mx-auto">
            <Input
              placeholder="Describe your database (e.g., Blog with authors, posts, comments)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-effect text-white placeholder-gray-400 text-lg py-6 px-6 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50 transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <div className="absolute inset-0 bg-glow-gradient opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
          </div>

          <Button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-neon-violet to-soft-blue hover:from-soft-blue hover:to-neon-violet text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-pulse-glow"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Magic
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto animate-slide-in" style={{ animationDelay: '0.6s' }}>
          Transform your database ideas into perfect SQL queries with the power of AI magic
        </p>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-glow-gradient opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;
