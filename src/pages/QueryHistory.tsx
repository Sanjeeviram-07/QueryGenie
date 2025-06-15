
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Search, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';

interface HistoryEntry {
  id: string;
  description: string;
  date: string;
  time: string;
  queryCount: number;
}

const QueryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Sample history data
    const sampleHistory: HistoryEntry[] = [
      {
        id: '1',
        description: 'Blog with authors, posts, comments',
        date: '2024-01-15',
        time: '14:30',
        queryCount: 6
      },
      {
        id: '2',
        description: 'E-commerce with products, orders, customers',
        date: '2024-01-14',
        time: '10:15',
        queryCount: 8
      },
      {
        id: '3',
        description: 'Social media platform with users, posts, likes',
        date: '2024-01-13',
        time: '16:45',
        queryCount: 10
      },
      {
        id: '4',
        description: 'Task management with projects, tasks, users',
        date: '2024-01-12',
        time: '09:20',
        queryCount: 7
      }
    ];

    setHistoryEntries(sampleHistory);
  }, []);

  const filteredEntries = historyEntries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-query-gradient">
      <ParticleBackground />
      <Navbar />
      
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-in">
            <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              <span className="glow-text">Query</span> <span className="text-white">History</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Revisit your magical SQL generations
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search your query history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass-effect pl-10 text-white placeholder-gray-400 border-white/20 focus:border-neon-violet focus:ring-2 focus:ring-neon-violet/50"
                />
              </div>
              <Button 
                variant="outline" 
                className="glass-effect border-white/20 text-white hover:bg-white/10 hover:border-neon-violet transition-all duration-300"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* History Entries */}
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <Card className="crystal-effect text-center py-12 animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No queries found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredEntries.map((entry, index) => (
                <Card 
                  key={entry.id} 
                  className="crystal-effect hover:shadow-glow transition-all duration-300 cursor-pointer animate-slide-in"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="text-lg font-medium truncate mr-4">
                        {entry.description}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-neon-violet/20 text-neon-violet transition-all duration-300 flex-shrink-0"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Queries
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(entry.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {entry.time}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-neon-violet/20 text-neon-violet px-2 py-1 rounded-full text-xs">
                          {entry.queryCount} queries
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredEntries.length > 0 && (
            <div className="text-center mt-8 animate-slide-in" style={{ animationDelay: '0.8s' }}>
              <Button 
                variant="outline" 
                className="glass-effect border-white/20 text-white hover:bg-white/10 hover:border-neon-violet transition-all duration-300"
              >
                Load More History
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;
