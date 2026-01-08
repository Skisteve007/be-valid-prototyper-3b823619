import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Ghost, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import GhostEcosystemModule from "@/components/demos/GhostEcosystemModule";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";

const GhostDemos = () => {
  return (
    <>
      <Helmet>
        <title>Ghost Ecosystem Demos | Valid™</title>
        <meta name="description" content="Explore Ghost Pass and wallet demos. Privacy-preserving verification using time-bound, tokenized permissions." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <Button variant="ghost" size="icon" asChild className="shrink-0">
                  <Link to="/demos">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                  <Ghost className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Ghost Ecosystem</h1>
                  <p className="text-sm text-muted-foreground hidden sm:block">Wallet + Pass mechanics (privacy-preserving)</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link to="/demos">← Demo Hub</Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Demo Environment Notice */}
          <DemoEnvironmentNotice variant="banner" />

          {/* Ghost Ecosystem Module */}
          <GhostEcosystemModule />

          {/* Back to Demo Hub */}
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/demos" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Demo Hub
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  );
};

export default GhostDemos;
