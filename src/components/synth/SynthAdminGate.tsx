import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useIsSynthAdmin } from '@/hooks/useIsSynthAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft, ShieldX } from 'lucide-react';

interface SynthAdminGateProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const SynthAdminGate: React.FC<SynthAdminGateProps> = ({ children, pageTitle }) => {
  const { isSynthAdmin, isLoading } = useIsSynthAdmin();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Verifying access...</div>
      </div>
    );
  }

  if (!isSynthAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Access Denied | SYNTH™</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
          <Card className="max-w-md w-full border-red-500/30 bg-red-500/5">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <ShieldX className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-2xl text-foreground">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                This document is restricted to authorized SYNTH™ administrators only.
              </p>
              <p className="text-xs text-muted-foreground/70">
                If you believe you should have access, contact the system administrator.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-muted-foreground/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/synth/docs')}
                  className="border-muted-foreground/30"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Public Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        {pageTitle && <title>{pageTitle} | SYNTH™ Internal</title>}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {children}
    </>
  );
};

export default SynthAdminGate;
