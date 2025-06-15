import React, { useState, useEffect } from 'react';
import { Copy, Check, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Type for query history row
type QueryHistoryRow = {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
  user_id: string;
};

const EDGE_FUNCTION_PATH = "generate-sql";

const QueryEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth({ redirectTo: "/auth" });

  const [prompt, setPrompt] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<QueryHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch query history for current user from DB
  useEffect(() => {
    if (!user) return;
    supabase
      .from('query_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (data) setHistory(data as QueryHistoryRow[]);
      });
  }, [user, generatedQuery]);

  // Replace the old static response AI generator with an edge function call
  const generateFromChatGPT = async (desc: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_PATH, {
      body: { prompt: desc }
    });
    if (error || !data || !data.generatedSql) {
      throw new Error(error?.message || "Failed to generate SQL from AI");
    }
    return data.generatedSql as string;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Please enter a description to generate SQL', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      // "AI" generates SQL (replace with real call for production)
      const aiResponse = await generateFromChatGPT(prompt);
      setGeneratedQuery(aiResponse);

      // Save to Supabase
      if (user) {
        const { error } = await supabase
          .from('query_history')
          .insert({
            user_id: user.id,
            prompt: prompt,
            response: aiResponse,
          });
        if (error) {
          toast({ title: "Failed to save history!", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Saved!", description: "Query and response saved to your history." });
        }
      }
    } catch (e: any) {
      toast({ title: "Something went wrong!", description: e.message, variant: "destructive" });
    }
    setLoading(false);
    setPrompt('');
  };

  const handleCopy = async (query: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      toast({ title: "Copied!", description: "Query copied to clipboard." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Failed!", description: "Could not copy.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-white">Describe your database task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-col md:flex-row">
            <Input
              placeholder="Describe (e.g. Blog with authors, posts...)"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => (e.key === 'Enter' ? handleGenerate() : undefined)}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="bg-gradient-to-r from-neon-violet to-soft-blue text-white"
            >
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedQuery && (
        <Card className="mb-10 crystal-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              AI Generated SQL
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-neon-violet/20 transition-all duration-300"
                onClick={() => handleCopy(generatedQuery)}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
              <code>{generatedQuery}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-xl text-white mb-2">Your Query History</h2>
        {history.length === 0 ? (
          <div className="text-gray-400 mb-4">No queries yet.</div>
        ) : (
          history.map(q => (
            <Card className="mb-4 crystal-effect" key={q.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="truncate">{q.prompt}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(q.response)}
                    className="hover:bg-neon-violet/20 transition-all duration-300"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-1">
                  <span className="text-xs text-gray-500">{new Date(q.created_at).toLocaleString()}</span>
                </div>
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  <code>{q.response}</code>
                </pre>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default QueryEditor;
