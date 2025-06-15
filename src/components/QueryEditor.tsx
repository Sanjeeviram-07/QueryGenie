
import React, { useState, useEffect } from 'react';
import { Copy, Check, Eye, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface QueryBlock {
  id: string;
  title: string;
  query: string;
  explanation: string;
  type: 'schema' | 'view' | 'query';
}

const QueryEditor = () => {
  const [queries, setQueries] = useState<QueryBlock[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Get description from localStorage
    const savedDescription = localStorage.getItem('queryDescription') || 'Blog with authors, posts, comments';
    setDescription(savedDescription);

    // Generate sample queries based on description
    generateSampleQueries(savedDescription);
  }, []);

  const generateSampleQueries = (desc: string) => {
    const sampleQueries: QueryBlock[] = [
      {
        id: '1',
        title: 'Authors Table Schema',
        type: 'schema',
        query: `CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        explanation: 'Creates the authors table with essential fields for storing author information.'
      },
      {
        id: '2',
        title: 'Posts Table Schema',
        type: 'schema',
        query: `CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        explanation: 'Creates the posts table with foreign key relationship to authors.'
      },
      {
        id: '3',
        title: 'Comments Table Schema',
        type: 'schema',
        query: `CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        explanation: 'Creates the comments table linked to posts with moderation capability.'
      },
      {
        id: '4',
        title: 'Popular Posts View',
        type: 'view',
        query: `CREATE VIEW popular_posts AS
SELECT 
    p.id,
    p.title,
    a.name as author_name,
    COUNT(c.id) as comment_count,
    p.published_at
FROM posts p
JOIN authors a ON p.author_id = a.id
LEFT JOIN comments c ON p.id = c.post_id AND c.approved = TRUE
WHERE p.status = 'published'
GROUP BY p.id, p.title, a.name, p.published_at
ORDER BY comment_count DESC, p.published_at DESC;`,
        explanation: 'Creates a view showing posts ranked by comment count for popularity analysis.'
      },
      {
        id: '5',
        title: 'Get Author with Post Count',
        type: 'query',
        query: `SELECT 
    a.id,
    a.name,
    a.email,
    COUNT(p.id) as total_posts,
    COUNT(CASE WHEN p.status = 'published' THEN 1 END) as published_posts
FROM authors a
LEFT JOIN posts p ON a.id = p.author_id
GROUP BY a.id, a.name, a.email
ORDER BY total_posts DESC;`,
        explanation: 'Retrieves all authors with their post statistics for dashboard display.'
      },
      {
        id: '6',
        title: 'Recent Posts with Comments',
        type: 'query',
        query: `SELECT 
    p.id,
    p.title,
    a.name as author_name,
    p.published_at,
    COUNT(c.id) as comment_count,
    STRING_AGG(DISTINCT c.author_name, ', ') as commenters
FROM posts p
JOIN authors a ON p.author_id = a.id
LEFT JOIN comments c ON p.id = c.post_id AND c.approved = TRUE
WHERE p.status = 'published' 
    AND p.published_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id, p.title, a.name, p.published_at
ORDER BY p.published_at DESC
LIMIT 10;`,
        explanation: 'Gets the 10 most recent published posts with comment information for the homepage.'
      }
    ];

    // Animate the queries appearing one by one
    sampleQueries.forEach((query, index) => {
      setTimeout(() => {
        setQueries(prev => [...prev, query]);
      }, index * 500);
    });
  };

  const copyToClipboard = async (query: string, id: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedId(id);
      toast({
        title: "Copied! ✨",
        description: "Query copied to clipboard",
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'schema': return Database;
      case 'view': return Eye;
      case 'query': return Zap;
      default: return Database;
    }
  };

  const groupedQueries = {
    schema: queries.filter(q => q.type === 'schema'),
    view: queries.filter(q => q.type === 'view'),
    query: queries.filter(q => q.type === 'query'),
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-slide-in">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <span className="glow-text">Magic Generated</span> <span className="text-white">Queries</span>
          </h2>
          <p className="text-gray-300 text-lg">
            For: <span className="text-neon-violet font-semibold">{description}</span>
          </p>
        </div>

        <Tabs defaultValue="schema" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-effect border-white/20 mb-8">
            {Object.entries(groupedQueries).map(([type, typeQueries]) => {
              const Icon = getTabIcon(type);
              return (
                <TabsTrigger 
                  key={type} 
                  value={type}
                  className="data-[state=active]:bg-neon-violet/20 data-[state=active]:text-neon-violet hover-glass transition-all duration-300"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}s ({typeQueries.length})
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(groupedQueries).map(([type, typeQueries]) => (
            <TabsContent key={type} value={type} className="space-y-6">
              {typeQueries.map((queryBlock, index) => (
                <Card 
                  key={queryBlock.id} 
                  className="crystal-effect hover:shadow-glow transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        {React.createElement(getTabIcon(queryBlock.type), { className: "mr-2 h-5 w-5 text-neon-violet" })}
                        {queryBlock.title}
                      </span>
                      <Button
                        onClick={() => copyToClipboard(queryBlock.query, queryBlock.id)}
                        variant="ghost"
                        size="sm"
                        className="hover:bg-neon-violet/20 transition-all duration-300"
                      >
                        {copiedId === queryBlock.id ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="glass-effect p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                          <code>{queryBlock.query}</code>
                        </pre>
                      </div>
                      <div className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border-l-4 border-soft-blue">
                        <strong className="text-soft-blue">What this does:</strong> {queryBlock.explanation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default QueryEditor;
