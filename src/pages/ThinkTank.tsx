import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Brain, BookOpen, FileText, ClipboardList, Copy, Pin, ArrowLeft, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ResponsiveHeader from '@/components/ResponsiveHeader';
import { Helmet } from 'react-helmet-async';

type ThinkTankCategory = 'synth_standards' | 'playbooks' | 'decision_log' | 'templates';

interface ThinkTankEntry {
  id: string;
  title: string;
  slug: string;
  category: ThinkTankCategory;
  tags: string[];
  content: string;
  excerpt: string | null;
  is_featured: boolean;
  author_name: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

const categoryConfig: Record<ThinkTankCategory, { label: string; icon: React.ReactNode; color: string }> = {
  synth_standards: { label: 'SYNTH™ Standards', icon: <Brain className="h-4 w-4" />, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30' },
  playbooks: { label: 'Playbooks', icon: <BookOpen className="h-4 w-4" />, color: 'bg-amber-500/20 text-amber-400 border-amber-400/30' },
  decision_log: { label: 'Decision Log', icon: <ClipboardList className="h-4 w-4" />, color: 'bg-purple-500/20 text-purple-400 border-purple-400/30' },
  templates: { label: 'Templates', icon: <FileText className="h-4 w-4" />, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30' },
};

const ThinkTank = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThinkTankCategory | 'all'>('all');
  const [selectedEntry, setSelectedEntry] = useState<ThinkTankEntry | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ['think-tank-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('think_tank_entries')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ThinkTankEntry[];
    },
  });

  const filteredEntries = useMemo(() => {
    if (!entries) return [];
    
    return entries.filter(entry => {
      const matchesSearch = searchQuery === '' || 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [entries, searchQuery, selectedCategory]);

  const featuredEntries = filteredEntries.filter(e => e.is_featured);
  const regularEntries = filteredEntries.filter(e => !e.is_featured);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (selectedEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Helmet>
          <title>{selectedEntry.title} | Think Tank | VALID™</title>
          <meta name="description" content={selectedEntry.excerpt || selectedEntry.title} />
        </Helmet>
        <ResponsiveHeader />
        
        <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedEntry(null)}
            className="mb-6 text-cyan-400 hover:text-cyan-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Think Tank
          </Button>

          <article className="prose prose-invert prose-cyan max-w-none">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={categoryConfig[selectedEntry.category].color}>
                {categoryConfig[selectedEntry.category].icon}
                <span className="ml-1">{categoryConfig[selectedEntry.category].label}</span>
              </Badge>
              {selectedEntry.is_featured && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/30">
                  <Pin className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{selectedEntry.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-700">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {formatDate(selectedEntry.updated_at)}
              </span>
              {selectedEntry.author_name && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedEntry.author_name}
                </span>
              )}
              <span className="text-xs">v{selectedEntry.version}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedEntry.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(selectedEntry.content)}
                className="absolute top-0 right-0 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All
              </Button>
              
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 whitespace-pre-wrap text-slate-200 leading-relaxed">
                {selectedEntry.content}
              </div>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Helmet>
        <title>Think Tank | VALID™ Knowledge Base</title>
        <meta name="description" content="SYNTH™ standards, playbooks, decision logs, and templates for the VALID™ ecosystem." />
      </Helmet>
      <ResponsiveHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Think Tank
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The SYNTH™ brain — standards, playbooks, decision logs, and templates that power our methodology.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-cyan-600' : ''}
            >
              All
            </Button>
            {(Object.keys(categoryConfig) as ThinkTankCategory[]).map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? categoryConfig[cat].color.replace('text-', 'bg-').replace('/20', '/80').split(' ')[0] : ''}
              >
                {categoryConfig[cat].icon}
                <span className="ml-1">{categoryConfig[cat].label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Featured Entries */}
        {featuredEntries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <Pin className="h-5 w-5" />
              Featured
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEntries.map(entry => (
                <Card
                  key={entry.id}
                  className="bg-gradient-to-br from-amber-500/10 to-slate-800/50 border-amber-400/30 cursor-pointer hover:border-amber-400/60 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${categoryConfig[entry.category].color} text-xs`}>
                        {categoryConfig[entry.category].icon}
                        <span className="ml-1">{categoryConfig[entry.category].label}</span>
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-lg">{entry.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                      {entry.excerpt || entry.content.slice(0, 150) + '...'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Entries */}
        {regularEntries.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularEntries.map(entry => (
              <Card
                key={entry.id}
                className="bg-slate-800/50 border-slate-700 cursor-pointer hover:border-cyan-400/40 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
                onClick={() => setSelectedEntry(entry)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${categoryConfig[entry.category].color} text-xs`}>
                      {categoryConfig[entry.category].icon}
                      <span className="ml-1">{categoryConfig[entry.category].label}</span>
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{entry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                    {entry.excerpt || entry.content.slice(0, 150) + '...'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(entry.updated_at)}</span>
                    <div className="flex gap-1">
                      {entry.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredEntries.length === 0 && (
          <div className="text-center py-16">
            <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No entries found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ThinkTank;
