import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingDown, Database, Trash2, Archive, Gauge, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataCostSavings = () => {
  return (
    <>
      <Helmet>
        <title>Cut Data Storage Costs with Governance & Minimization | Giant Ventures</title>
        <meta name="description" content="Reduce storage by enforcing retention, dedupe, and cold storage policies. Save on data and inference costs with smart pipelines." />
        <meta name="keywords" content="reduce data storage costs, data minimization, dedupe, cold storage, cost-aware retention, storage optimization, log reduction, data lifecycle" />
        <link rel="canonical" href="https://www.bevalid.app/data-cost-savings" />
        <meta property="og:title" content="Cut Data Storage Costs | Giant Ventures" />
        <meta property="og:description" content="Reduce storage by enforcing retention, dedupe, and cold storage policies. Save on data and inference costs with smart pipelines." />
        <meta property="og:url" content="https://www.bevalid.app/data-cost-savings" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Data Cost Optimization",
            "provider": { "@type": "Organization", "name": "Giant Ventures LLC" },
            "areaServed": "Global",
            "description": "Reduce storage costs through governance-driven minimization, deduplication, and lifecycle management.",
            "category": "DataManagement"
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingDown className="h-8 w-8 text-green-500" />
              <span className="text-sm font-semibold text-green-500 uppercase tracking-wider">Cost Optimization</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-orbitron mb-6 text-foreground">
              Spend Less on Storage—Keep More Business Value
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              Storage bloat is expensive and risky. Our governance pipelines minimize, deduplicate, 
              and time-box data so you only store what creates value. Customers report 25–60% storage 
              reduction alongside lower inference and retrieval costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold">
                <Link to="/demos">
                  Get a Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-5xl font-bold text-green-500 mb-2">25-60%</p>
                <p className="text-muted-foreground">Storage reduction</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-green-500 mb-2">40%</p>
                <p className="text-muted-foreground">Lower inference costs</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-green-500 mb-2">3x</p>
                <p className="text-muted-foreground">Faster retrieval</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cost Saving Features */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-orbitron mb-12 text-center">
              How We Cut Your Data Costs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-green-500/30 bg-card/50">
                <CardHeader>
                  <Database className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Data Minimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Store only what you need. Governance policies automatically 
                    identify and prevent unnecessary data accumulation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-card/50">
                <CardHeader>
                  <Trash2 className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Deduplication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Eliminate redundant copies across systems. Content-aware 
                    deduplication maintains references without bloat.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-card/50">
                <CardHeader>
                  <Archive className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Cold Storage Tiering</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Move cold data to cheaper tiers automatically. Access patterns 
                    drive intelligent lifecycle transitions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-card/50">
                <CardHeader>
                  <Gauge className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Context Window Trimming</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Lower inference costs by trimming irrelevant context. 
                    Smart summarization preserves meaning while reducing tokens.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-card/50">
                <CardHeader>
                  <DollarSign className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Log Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Keep audit trails, not verbose logs. Governance-driven 
                    pruning retains only forensically relevant records.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-card/50">
                <CardHeader>
                  <TrendingDown className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Compression</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Intelligent compression based on data type and access patterns. 
                    Reduce footprint without sacrificing performance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ROI Callout */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-cyan-500/5">
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-2xl font-bold font-orbitron mb-4">
                  Typical ROI in 90 Days
                </h3>
                <p className="text-muted-foreground mb-6">
                  Most customers see positive ROI within the first quarter. Savings come from:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Direct storage cost reduction (25-60%)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Lower AI inference costs from smaller context windows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Faster query performance reducing compute spend</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span>Reduced compliance risk and potential breach liability</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-orbitron mb-6">
              Ready to Cut Your Data Costs?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See a personalized analysis of potential savings for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold">
                <Link to="/demos">Request Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/ephemeral-data-flushing">Learn About Data Flushing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DataCostSavings;
