import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import TypewriterText from '@/components/TypewriterText';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';

const EDGE_FUNCTION_PATH = "generate-sql";

const HeroSection = () => {
  const [description, setDescription] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const typewriterTexts = [
    "From app idea to SQL magic — instantly.",
    "Auto-generate database schemas from your thoughts.",
    "Describe it. We query it."
  ];

  const handleGenerate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Please describe your database",
        description: "Enter a description to generate SQL queries",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedSql(null);
    setShowDialog(true);

    try {
      // Call edge function to get AI SQL
      const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_PATH, {
        body: { prompt: description }
      });
      if (error || !data?.generatedSql) {
        throw new Error(error?.message || "Failed to generate SQL from AI");
      }
      setGeneratedSql(data.generatedSql);
    } catch (e: any) {
      setGeneratedSql(null);
      toast({
        title: "Something went wrong!",
        description: e.message || "Sorry, there was a problem generating your SQL.",
        variant: "destructive"
      });
      setShowDialog(false);
    }
    setLoading(false);
  };

  const handleCopy = async () => {
    if (generatedSql) {
      try {
        await navigator.clipboard.writeText(generatedSql);
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Query copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 1800);
      } catch {
        toast({
          title: "Failed!",
          description: "Could not copy.",
          variant: "destructive",
        });
      }
    }
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

        {/* Typewriter Tagline */}
        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <TypewriterText 
            texts={typewriterTexts}
            speed={80}
            pauseBetween={3000}
            className="text-xl md:text-2xl text-gray-300 font-inter min-h-[2rem]"
          />
        </div>

        {/* Input Section */}
        <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative max-w-2xl mx-auto">
            <Input
              placeholder="Describe your database (e.g., Blog with authors, posts, comments)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="glass-effect text-white placeholder-gray-400 text-lg py-6 px-6 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50 transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={loading}
            />
            <div className="absolute inset-0 bg-glow-gradient opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"></div>
          </div>

          <Button
            onClick={handleGenerate}
            className="bg-gradient-to-r from-neon-violet to-soft-blue hover:from-soft-blue hover:to-neon-violet text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-pulse-glow"
            disabled={loading}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {loading ? 'Generating...' : 'Generate Magic'}
          </Button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto animate-slide-in" style={{ animationDelay: '0.8s' }}>
          Transform your database ideas into perfect SQL queries with the power of AI magic
        </p>
      </div>

      {/* AI Generated SQL Result Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card text-white max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>AI Generated SQL</DialogTitle>
          </DialogHeader>
          <div className="mb-4 min-h-[90px]">
            {loading && (
              <div className="text-gray-300 my-3 text-center">Generating your SQL...</div>
            )}
            {!loading && generatedSql && (
              <div>
                <div className="flex justify-end mb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-neon-violet/20 transition-all duration-300"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-48 overflow-auto bg-black/30 p-3 rounded-md">
                  <code>{generatedSql}</code>
                </pre>
              </div>
            )}
            {!loading && !generatedSql && (
              <div className="text-gray-400">No SQL generated (try again with a new description)</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="default" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-glow-gradient opacity-10 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;
