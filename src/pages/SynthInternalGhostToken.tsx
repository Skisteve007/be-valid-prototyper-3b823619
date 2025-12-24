import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { SynthAdminGate } from '@/components/synth/SynthAdminGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Ghost, Lock } from 'lucide-react';

const SynthInternalGhostToken: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/GHOST_TOKEN_SPEC_INTERNAL.md');
        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent('# Error\n\nFailed to load document.');
        }
      } catch (error) {
        console.error('Error loading doc:', error);
        setContent('# Error\n\nFailed to load document.');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  return (
    <SynthAdminGate pageTitle="Ghost Token Specification">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/synth/docs')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Ghost className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
                    Ghost Token Specification
                    <Lock className="w-4 h-4 text-amber-400" />
                  </h1>
                  <p className="text-xs text-muted-foreground">Internal Admin Document</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="border-cyan-500/20">
            <CardContent className="p-8">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground animate-pulse">
                  Loading document...
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono bg-muted/30 p-6 rounded-lg overflow-x-auto">
                    {content}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </SynthAdminGate>
  );
};

export default SynthInternalGhostToken;
